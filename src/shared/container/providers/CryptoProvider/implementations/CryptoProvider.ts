import {
  randomBytes,
  createCipheriv,
  createDecipheriv,
  createHash,
  generateKeyPairSync,
} from 'node:crypto';
import {
  readFileSync,
  appendFileSync,
  truncateSync,
  existsSync,
  mkdirSync,
} from 'node:fs';
import { resolve } from 'node:path';
import { sign, SignOptions } from 'jsonwebtoken';
// Tipos de 'pem-jwk' nem sempre existem; importa só a função:
import { pem2jwk } from 'pem-jwk';

import { cryptoConfig } from '@config/crypto';
import { authConfig } from '@config/auth';

import { ICryptoDTO } from '../dtos/ICryptoDTO';
import { ICryptoProviderDTO } from '../models/ICryptoProvider';

function getAesKeyFromEnv(): Buffer {
  // aes-256-ctr precisa de chave de 32 bytes.
  // Vamos montar a partir de CRYPTO_SECRET_KEY em hex;
  // se vier curta, a gente faz pad à direita com zeros.
  const hex = (cryptoConfig.config.secretKey || '').trim();
  const paddedHex = (hex.padEnd(64, '0')).slice(0, 64); // 32 bytes = 64 hex chars
  return Buffer.from(paddedHex, 'hex');
}

export class CryptoProvider implements ICryptoProviderDTO {
  public encrypt(text: string): ICryptoDTO {
    const iv = randomBytes(16);
    const key = getAesKeyFromEnv();

    const cipher = createCipheriv(
      cryptoConfig.config.algorithm as any, // tipos do node às vezes implicam com string literal
      key,
      iv,
    );

    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

    return {
      iv: iv.toString(cryptoConfig.config.encoding),
      content: encrypted.toString(cryptoConfig.config.encoding),
    };
  }

  public decrypt(data: ICryptoDTO): string {
    const key = getAesKeyFromEnv();
    const iv = Buffer.from(data.iv, cryptoConfig.config.encoding);
    const content = Buffer.from(data.content, cryptoConfig.config.encoding);

    const decipher = createDecipheriv(
      cryptoConfig.config.algorithm as any,
      key,
      iv,
    );

    const decrypted = Buffer.concat([decipher.update(content), decipher.final()]);
    return decrypted.toString('utf8');
  }

  public generateRefreshToken(ip: string): string {
    return createHash('sha256').update(ip).digest('hex');
  }

  public generateJwt(
    payload: object,
    ip: string,
    options?: Omit<SignOptions, 'algorithm'>,
  ): {
    jwt_token: string;
    refresh_token: string;
  } {
    const privateKeyPath = resolve(cryptoConfig.config.keysPath, 'private.pem');
    const secret = readFileSync(privateKeyPath); // Buffer

    const jwtToken = sign(payload, secret, {
      expiresIn: authConfig.config.jwt.expiresIn,
      algorithm: 'RS256',
      ...options,
    });

    const refreshToken = this.generateRefreshToken(ip);

    return {
      jwt_token: jwtToken,
      refresh_token: refreshToken,
    };
  }

  public generateKeys(): any /* JWK */ {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 3072,
    });

    const publicExported = publicKey.export({ format: 'pem', type: 'pkcs1' }).toString();
    const privateExported = privateKey.export({ format: 'pem', type: 'pkcs1' }).toString();

    const parsedJwk = pem2jwk(publicExported, { use: 'sig' } as any);
    const jwksJson = { keys: [parsedJwk] };

    const keysDir = resolve(cryptoConfig.config.keysPath);
    const wellKnownDir = resolve(cryptoConfig.config.assetsPath, '.well-known');
    const privatePath = resolve(keysDir, 'private.pem');
    const publicPath = resolve(keysDir, 'public.pem');
    const jwksPath = cryptoConfig.config.jwksPath;

    // Garante diretórios
    mkdirSync(keysDir, { recursive: true });
    mkdirSync(wellKnownDir, { recursive: true });

    // Salva chaves
    if (existsSync(privatePath)) truncateSync(privatePath);
    appendFileSync(privatePath, privateExported);

    if (existsSync(publicPath)) truncateSync(publicPath);
    appendFileSync(publicPath, publicExported);

    if (existsSync(jwksPath)) truncateSync(jwksPath);
    appendFileSync(jwksPath, JSON.stringify(jwksJson, null, 2));

    return parsedJwk;
  }
}
