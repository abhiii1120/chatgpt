import type { Request, Response } from "express";
import type { RegisterUserRequest, UserResponse } from "../types/user.js";
import { userDao } from "../dao/user.dao.js";
import alreadyExistsError from "../utils/errors/alreadyExists.js";
import { hashPassword, sha256 } from "../utils/crypto.js";
import { Types } from "mongoose";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";
import { sessionDao } from "../dao/session.dao.js";
import { env, isProduction } from "../config/env.js";
import type { AuthSuccessResponse } from "../types/auth.js";

async function createSessionAndTokens(params: {
  userId: string;
  email: string;
  userAgent: string;
  ipAddress: string;
}) {
  const sessionId = new Types.ObjectId().toString();
  const refreshToken = signRefreshToken({ userId: params.userId, sessionId });
  const accessToken = signAccessToken({
    userId: params.userId,
    email: params.email,
  });

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await sessionDao.createSession({
    sessionId,
    userId: params.userId,
    refreshTokenHash: sha256(refreshToken),
    expiresAt,
    userAgent: params.userAgent,
    ipAddress: params.ipAddress,
  });

  return { accessToken, refreshToken, sessionId };
}

function cookieOptions() {
    return {
        httpOnly:true,
        sameSite:"lax" as const,
        secure:isProduction,
        path:'/'
    }
}

function sanitizeUser(user: { _id: string; name: string; email: string }): UserResponse {
  return {
    id: user._id,
    name: user.name,
    email: user.email
  };
}

export const register = async (req: Request, res: Response) => {
  const { email, password, name } = req.body as RegisterUserRequest;

  const isExisting = await userDao.findByEmail(String(email));
  if (isExisting) {
    throw new alreadyExistsError("User already exists");
  }

  const passwordHash = await hashPassword(String(password));

  const user = await userDao.createUser({
    name: String(name),
    email: String(email).toLowerCase(),
    passwordHash,
  });

  const createSessionPayload  = {
    userId : user._id.toString(),
    email:user.email,
    userAgent : req.headers["user-agent"] ?? "unknown",
    ipAddress:req.ip ?? "unknown"
  }

  const {accessToken , refreshToken} = await createSessionAndTokens(createSessionPayload);

  res.cookie(env.refreshCookieName,refreshToken,cookieOptions());
  const response : AuthSuccessResponse = {
    accessToken,
    message:"Registered Successfully",
    refreshToken,
    user: sanitizeUser({
        _id:user._id.toString(),
        name:user.name,
        email:user.email
    })
  };

  res.status(201).json(response)
};
