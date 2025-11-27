import request from 'supertest';
import { app } from '@shared/app';
import { IConnection } from '@shared/typeorm';
import { MysqlDataSource } from '@shared/typeorm/dataSources/mysqlDataSource';

const id = '123';

let connection: IConnection;
describe('DeleteEventController', (): void => {
  beforeAll(async (): Promise<void> => {
    connection = {
      client: 'database',
      mysql: await MysqlDataSource('database').initialize(),
    };
    await connection.mysql.runMigrations();

    await connection.mysql.query(
      'INSERT INTO folders (id, name, slug) VALUES (?, ?, ?);',
      ['456', '67890', 'other'],
    );

    return connection.mysql.query(
      'INSERT INTO events (id, title, description, date, time, capacity, price, file_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW());',
      [
        '123', // id
        'Test Event', // title
        'Test Description', // description
        '2025-09-20', // date
        '18:00', // time
        0, // capacity
        0, // price
        null, // file_id
      ],
    );
  });

  afterAll(async (): Promise<void> => {
    await connection.mysql.dropDatabase();
    await connection.mysql.destroy();
  });

  it('Should be able to delete a event', async (): Promise<void> => {
    const response = await request(app.server).delete(`/events/${id}`);

    expect(response.status).toBe(200);
  });
});
