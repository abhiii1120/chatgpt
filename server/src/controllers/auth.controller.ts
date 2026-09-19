import type { Request, Response } from "express";
import type {
  LoginUserRequest,
  RegisterUserRequest,
  UserResponse,
} from "../types/user.js";
import { userDao } from "../dao/user.dao.js";
import alreadyExistsError from "../utils/errors/alreadyExists.js";
import { comparePassword, hashPassword, sha256 } from "../utils/crypto.js";
import { Types } from "mongoose";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { env, isProduction } from "../config/env.js";
import type {
  AuthSuccessResponse,
  RefreshTokenResponse,
} from "../types/auth.js";
import notFound from "../utils/errors/notFound.js";
import unauthorizedError from "../utils/errors/unauthorized.js";
import { sessionDao } from "../dao/session.dao.js";
import { cookie } from "express-validator";

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
    httpOnly: true,
    sameSite: "lax" as const,
    secure: isProduction,
    path: "/",
  };
}

function sanitizeUser(user: {
  _id: string;
  name: string;
  email: string;
}): UserResponse {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
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

  const createSessionPayload = {
    userId: user._id.toString(),
    email: user.email,
    userAgent: req.headers["user-agent"] ?? "unknown",
    ipAddress: req.ip ?? "unknown",
  };

  const { accessToken, refreshToken } =
    await createSessionAndTokens(createSessionPayload);

  res.cookie(env.refreshCookieName, refreshToken, cookieOptions());
  const response: AuthSuccessResponse = {
    accessToken,
    message: "Registered Successfully",
    refreshToken,
    user: sanitizeUser({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    }),
  };

  res.status(201).json(response);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginUserRequest;

  const user = await userDao.findByEmail(String(email));

  if (!user) throw new notFound("User not found");

  const isValid = await comparePassword(String(password), user.passwordHash);

  if (!isValid) {
    throw new unauthorizedError("Password doesn't match");
  }

  const createSessionPayload = {
    userId: user._id.toString(),
    email: user.email,
    userAgent: req.headers["user-agent"] ?? "unknown",
    ipAddress: req.ip ?? "unknown",
  };

  const { accessToken, refreshToken } =
    await createSessionAndTokens(createSessionPayload);

  res.cookie(env.refreshCookieName, refreshToken, cookieOptions());

  const response: AuthSuccessResponse = {
    message: "Logged in successfully",
    accessToken,
    refreshToken,
    user: sanitizeUser({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    }),
  };

  res.status(200).json(response);
};

/**
 * excahnges a valid refresh token for a new access token + a new refresh token.
 * also validates that the token hasn't
 * been tampered with, revoked, or reused, and creates a fresh session to replace the old one.
 */
export const refresh = async (req: Request, res: Response) => {
  const incomingToken =
    req.cookies?.[env.refreshCookieName] ??
    (req.body?.refreshToken ? String(req.body.refreshToken) : "");
  if (!incomingToken) throw new unauthorizedError("Refreh token is required");

  const payload = verifyRefreshToken(incomingToken);

  if (payload.type !== "refresh")
    throw new unauthorizedError("Invalid refresh token type");

  const session = await sessionDao.findActiveById(payload.sessionId);

  if (!session) throw new unauthorizedError("Session is not active");

  const user = await userDao.findById(payload.userId);
  if (!user) {
    await sessionDao.revokeById(payload.sessionId);
    throw new unauthorizedError("User not found for session");
  }

  const sameToken = sha256(incomingToken) === session.refreshTokenHash;
  if (!sameToken) {
    await sessionDao.revokeById(payload.sessionId);
    throw new unauthorizedError("Invalid sesion token");
  }

  await sessionDao.revokeById(payload.sessionId);
  const nextAccessToken = signAccessToken({
    userId: payload.userId,
    email: user.email,
  });

  const nextSessionId = new Types.ObjectId().toString();
  const nextRefreshToken = signRefreshToken({
    userId: payload.userId,
    sessionId: nextSessionId,
  });

  await sessionDao.createSession({
    sessionId: nextSessionId,
    userId: payload.userId,
    refreshTokenHash: sha256(nextRefreshToken),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    userAgent: req.headers["user-agent"] ?? "unknown",
    ipAddress: req.ip ?? "unknown",
  });

  res.cookie(env.refreshCookieName, nextRefreshToken, cookieOptions());

  const response: RefreshTokenResponse = {
    message: "Token refeshed",
    accessToken: nextAccessToken,
    refreshToken: nextRefreshToken,
    user: sanitizeUser({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    }),
  };

  res.status(200).json(response);
};

export const logout = async (req:Request,res:Response) => {
  const incomingToken = req.cookies[env.refreshCookieName] ?? (req.body.refreshToken ? String(req.body.refreshToken) : "");

  if(incomingToken){
    try {
      const payload = verifyRefreshToken(incomingToken);
      await sessionDao.revokeById(payload.sessionId);
    } catch {
      
    }
  }

  res.clearCookie(env.refreshCookieName,cookieOptions());
  res.status(200).json({
    message:"logged out successfully",
  })
}

