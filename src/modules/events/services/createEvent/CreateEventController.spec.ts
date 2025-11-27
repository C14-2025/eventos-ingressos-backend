import request from 'supertest';
import { app } from '@shared/app';
import { IConnection } from '@shared/typeorm';
import { MysqlDataSource } from '@shared/typeorm/dataSources/mysqlDataSource';

const id = '123';

let connection: IConnection;
describe('CreateEventController', (): void => {
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
      'INSERT INTO files (id, folder_id, file, name) VALUES (?, ?, ?, ?);',
      [id, '456', 'test', 'test'],
    );
  });

  afterAll(async (): Promise<void> => {
    await connection.mysql.dropDatabase();
    await connection.mysql.destroy();
  });

  it('Should be able to create a new event', async (): Promise<void> => {
    const response = await request(app.server).post('/events').send({
      title: 'Test Event',
      file_id: id,
      date: '2025-09-20',
      description: 'teste',
      time: '18:00',
    });

    expect(response.status).toBe(201);
  });
});
