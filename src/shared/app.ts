import 'dotenv/config'; // carrega o .env logo no início
import 'express-async-errors';
import { setConnection } from '@middlewares/setConnection';
import { cryptoConfig } from '@config/crypto'; // caminho para as chaves
import cors from 'cors';
import express, { Express } from 'express';
import { corsConfig } from '@config/cors';
import { parseParam } from '@middlewares/parseParam';
import { errorHandler } from '@middlewares/errorHandler';
import { rateLimiter } from '@middlewares/rateLimiter';
import { serve, setup } from 'swagger-ui-express';
import swaggerDocs from '../swagger.json';
import { routes } from '../routes';
import path from 'node:path';
import '@shared/container';

class App {
  public readonly server: Express;

  public constructor() {
    this.server = express();
    this.middlewares();
    this.staticRoutes();
    this.routes();
    this.errorHandlers();
  }

  private middlewares(): void {
    this.server.use(setConnection);
    this.server.use(cors(corsConfig));
    // Desativei o rateLimiter por enquanto pra evitar bloqueio nos testes
    // this.server.use(rateLimiter);
    this.server.use(express.json());
    this.server.use(parseParam);
  }

  private staticRoutes(): void {
    this.server.use('/api-docs', serve, setup(swaggerDocs));

    // ✅ Aqui servimos diretamente o arquivo JWKS correto
    this.server.get('/jwks', (_req, res) => {
      res.sendFile(cryptoConfig.config.jwksPath);
    });

    // Caso queira servir a pasta uploads depois:
    // this.server.use('/uploads', express.static(storageConfig.config.uploadsFolder));
  }

  private errorHandlers(): void {
    this.server.use(errorHandler);
  }

  private routes(): void {
    this.server.use(routes);
  }

  public init(): void {
    const port = process.env.PORT || 3333;
    this.server.listen(port, () => {
      console.log(`🚀 Server started on port ${port}!`);
      console.log(`🔑 JWKS disponível em http://localhost:${port}/jwks`);
    });
  }
}

export const app = new App();
