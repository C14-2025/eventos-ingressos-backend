import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import { AppError } from '@shared/errors/AppError';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { cryptoConfig } from '@config/crypto';

interface ITokenPayload {
  iat: number;
  exp: number;
  id: string;
}

export function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT_TOKEN_MISSING', 'JWT token is missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const publicKeyPath = resolve(cryptoConfig.config.keysPath, 'public.pem');
    console.log('🔍 [JWT] Lendo chave pública em:', publicKeyPath);

    const publicKey = readFileSync(publicKeyPath, 'utf8');
    const decoded = verify(token, publicKey, { algorithms: ['RS256'] }) as ITokenPayload;

    request.user = { id: decoded.id };

    console.log('✅ Token válido! Usuário:', decoded.id);
    return next();
  } catch (err) {
    console.error('❌ Erro ao validar JWT:', err);
    throw new AppError('INVALID_JWT_TOKEN', 'Invalid JWT token', 401);
  }
}
