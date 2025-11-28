import request from 'supertest';
import path from 'path';
import { app } from '@shared/app';
import { IConnection } from '@shared/typeorm';
import { MysqlDataSource } from '@shared/typeorm/dataSources/mysqlDataSource';

let connection: IConnection;

describe('GenerateKeyController', () => {
  beforeAll(async () => {
    connection = {
      client: 'database',
      mysql: await MysqlDataSource('database').initialize(),
    };

    await connection.mysql.runMigrations();

  });

  afterAll(async () => {
    await connection.mysql.dropDatabase();
    await connection.mysql.destroy();
  });

  it('Should be able to generate a key', async () => {

    const response = await request(app.server)
      .post('/generate-keys')

    expect(response.status).toBe(201);
  });
});
