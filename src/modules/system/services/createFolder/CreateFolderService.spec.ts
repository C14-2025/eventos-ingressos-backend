import { IConnection, Connection } from '@shared/typeorm';
import { FakeDataSource } from '@shared/typeorm/dataSources/fakes/fakeDataSource';

import { CreateFolderService } from './CreateFolderService';

import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';

import { IFoldersRepositoryDTO } from '@modules/system/repositories/IFoldersRepository';
import { FakeFoldersRepository } from '@modules/system/repositories/fakes/FakeFoldersRepository';

let connection: IConnection;
let createFolderService: CreateFolderService;
let fakeFoldersRepository: IFoldersRepositoryDTO;
let fakeCacheProvider: ICacheProvider;

describe('CreateFolderService', () => {
  beforeAll(() => {
    connection = new Connection('database', FakeDataSource);
  });

  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();
    fakeFoldersRepository = new FakeFoldersRepository();

    createFolderService = new CreateFolderService(
      fakeFoldersRepository,
      fakeCacheProvider,
      connection
    );
  });

  it('should create a folder successfully', async () => {
    const folderData = {
      name: 'My Folder',
      slug: 'my-folder',
      parent_id: null,
    };

    const response = await createFolderService.execute(folderData);

    expect(response.code).toBe(201);
    expect(response.message_code).toBe('CREATED');
    expect(response.data).toHaveProperty('id');
    expect(response.data.name).toBe('My Folder');
  });

  it('should rollback transaction if repository throws error', async () => {
    jest
      .spyOn(fakeFoldersRepository, 'create')
      .mockRejectedValueOnce(new Error('Repository failure'));

    const folderData = {
      name: 'Error Folder',
      slug: 'error-folder',
      parent_id: null,
    };

    await expect(createFolderService.execute(folderData))
      .rejects
      .toThrow('Repository failure');
  });
});
