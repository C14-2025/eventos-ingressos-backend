import request from 'supertest';
import { MysqlDataSource } from '@shared/typeorm/dataSources/mysqlDataSource';
import { IConnection } from '@shared/typeorm';
import { app } from '@shared/app';

let connection: IConnection;

describe('ListEventController', (): void => {
  beforeAll(async (): Promise<void> => {
    connection = {
      client: 'database',
      mysql: await MysqlDataSource('database').initialize(),
    };
    await connection.mysql.runMigrations();

    return connection.mysql.query(
      'INSERT INTO events (id, title, description, date, time, capacity, price, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW());',
      [
        '123', // id
        'Test Event', // title
        'Test Description', // description
        '2025-09-20', // date
        '18:00', // time
        0, // capacity
        0, // price
      ],
    );
  });

  afterAll(async (): Promise<void> => {
    await connection.mysql.dropDatabase();
    return connection.mysql.destroy();
  });

  it('Should be able to list all events', async (): Promise<void> => {
    const response = await request(app.server).get('/events');

    expect(response.status).toBe(200);
  });
});
