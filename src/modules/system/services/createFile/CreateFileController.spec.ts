import request from 'supertest';
import path from 'path';
import { app } from '@shared/app';
import { IConnection } from '@shared/typeorm';
import { MysqlDataSource } from '@shared/typeorm/dataSources/mysqlDataSource';

const folder_id = '456';

let connection: IConnection;

describe('CreateFileController', () => {
  beforeAll(async () => {
    connection = {
      client: 'database',
      mysql: await MysqlDataSource('database').initialize(),
    };

    await connection.mysql.runMigrations();

    await connection.mysql.query(
      'INSERT INTO folders (id, name, slug) VALUES (?, ?, ?)',
      [folder_id, 'Folder Test', 'folder-test'],
    );
  });

  afterAll(async () => {
    await connection.mysql.dropDatabase();
    await connection.mysql.destroy();
  });

  it('Should be able to create a file', async () => {
    const filePath = path.resolve(__dirname, 'fixtures', 'image.jpg');

    const response = await request(app.server)
      .post('/files')
      .field('folder_id', folder_id)
      .attach('files', filePath);

    expect(response.status).toBe(201);
  });
});
