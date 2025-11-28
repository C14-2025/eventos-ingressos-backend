import request from 'supertest';
import { app } from '@shared/app';
import { IConnection } from '@shared/typeorm';
import { MysqlDataSource } from '@shared/typeorm/dataSources/mysqlDataSource';

const file_id = '123';
const event_id = '456'

let connection: IConnection;
describe('AuthenticateUserController', (): void => {
  beforeAll(async (): Promise<void> => {
    connection = {
      client: 'database',
      mysql: await MysqlDataSource('database').initialize(),
    };
    await connection.mysql.runMigrations();

  });

  afterAll(async (): Promise<void> => {
    await connection.mysql.dropDatabase();
    await connection.mysql.destroy();
  });

  it('Should be able to authenticate', async (): Promise<void> => {
    const userData = {
      email: "luisxb033@live.com",
      password: '123456'
    }

    await request(app.server).post('/users').send({ ...userData, name: "aaa" });

    const response = await request(app.server).post('/login').send(userData);

    expect(response.status).toBe(201);
  });
});
