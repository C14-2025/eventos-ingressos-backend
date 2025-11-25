import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { authConfig } from '@config/auth';
import { AppError } from '@shared/errors/AppError';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('BAD_REQUEST', 'Missing JWT', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    // const decoded = verify(token, authConfig.config.jwt);
    // const { sub } = decoded as ITokenPayload;

    // // request.user = {
    // //   id: sub,
    // // } as;

    return next();
  } catch {
    throw new AppError('BAD_REQUEST', 'Invalid JWT token', 401);
  }
}
