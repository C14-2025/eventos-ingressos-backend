import request from 'supertest';
import path from 'path';
import { app } from '@shared/app';
import { IConnection } from '@shared/typeorm';
import { MysqlDataSource } from '@shared/typeorm/dataSources/mysqlDataSource';

let connection: IConnection;

describe('CreateFolderController', () => {
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

  it('Should be able to create a folder', async () => {

    const response = await request(app.server)
      .post('/folders').send({
        slug: "folder"
      })

    expect(response.status).toBe(201);
  });
});
