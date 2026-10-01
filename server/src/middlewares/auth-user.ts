import type { NextFunction, Request, Response } from "express";
import unauthorizedError from "../utils/errors/unauthorized.js";
import { verifyAccessToken } from "../utils/jwt.js";

export function authUserMiddleware(req:Request,_res:Response,next:NextFunction):void{
    const authorizationHeader = req.headers.authorization;

    if(!authorizationHeader) throw new unauthorizedError('Authorization token is required');

    const [scheme,token] = authorizationHeader.split(' ');

    if(scheme != 'Bearer' || !token) throw new unauthorizedError("Invalid authorization format");

    try {
        const payload = verifyAccessToken(token);

        if(payload.type != 'access') throw new unauthorizedError("Invalid access token type");

        req.user = payload;
        next();
    } catch (error) {
        throw new unauthorizedError("Invalid or expired access token");
    }
}   