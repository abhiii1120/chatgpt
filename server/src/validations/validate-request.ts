import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import BadRequestError from '../utils/errors/badRequest.js';

export function validateRequest(req: Request, _res: Response, next: NextFunction): void {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    throw new BadRequestError(firstError ? String(firstError.msg) : "Validation failed");
  }


  next()
}