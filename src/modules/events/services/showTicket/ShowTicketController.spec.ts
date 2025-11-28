import request from 'supertest';
import { app } from '@shared/app';
import { IConnection } from '@shared/typeorm';
import { MysqlDataSource } from '@shared/typeorm/dataSources/mysqlDataSource';

const file_id = '123';
const event_id = '456'

let connection: IConnection;
describe('ShowTicketController', (): void => {
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

    await connection.mysql.query(
      'INSERT INTO files (id, folder_id, file, name) VALUES (?, ?, ?, ?);',
      [file_id, '456', 'test', 'test'],
    );

    return connection.mysql.query(
      'INSERT INTO events (id, file_id, date, description, time, title, capacity) VALUES (?, ?, ?, ?, ?, ?, ?);',
      [event_id, file_id, '2025-09-20', 'test', '18:00', 'test', 50],
    );
  });

  afterAll(async (): Promise<void> => {
    await connection.mysql.dropDatabase();
    await connection.mysql.destroy();
  });

  it('Should be able to show ticket', async (): Promise<void> => {
    const ticketResponse = await request(app.server).post('/events/sell-ticket').send({
      document: "106614626842",
      event_id: event_id
    });

    const document = ticketResponse.body.data.document

    const response = await request(app.server).get(`/tickets/${document}`)

    expect(response.status).toBe(200);
  });
});
