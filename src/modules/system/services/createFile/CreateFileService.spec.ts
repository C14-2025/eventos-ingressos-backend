import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { Connection, IConnection } from '@shared/typeorm';
import { FakeDataSource } from '@shared/typeorm/dataSources/fakes/fakeDataSource';
import { FakeFilesRepository } from '@shared/container/modules/system/repositories/fakes/FakeFilesRepository';
import { IFilesRepositoryDTO } from '@modules/system/repositories/IFilesRepository';
import { CreateFileService } from './CreateFileService';
import { FakeFoldersRepository } from '@shared/container/modules/system/repositories/fakes/FakeFoldersRepository';
import { IFoldersRepositoryDTO } from '@modules/system/repositories/IFoldersRepository';
import { IStorageProviderDTO } from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { FakeStorageProvider } from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import { AppError } from '@shared/errors/AppError';

let fakeCacheProvider: ICacheProvider;
let fakeFilesRepository: IFilesRepositoryDTO;
let createFileService: CreateFileService;
let fakeFoldersRepository: IFoldersRepositoryDTO;
let fakeStorageProvider: IStorageProviderDTO;
let connection: IConnection;
let queryRunner: any;

describe('CreateFileService', () => {
  beforeAll(() => {
    connection = new Connection('database', FakeDataSource);
  });

  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();
    fakeFilesRepository = new FakeFilesRepository();
    fakeFoldersRepository = new FakeFoldersRepository();
    fakeStorageProvider = new FakeStorageProvider();

    queryRunner = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      isTransactionActive: true,
      isReleased: false,
    };

    jest.spyOn(connection.mysql, 'createQueryRunner').mockReturnValue(queryRunner);

    createFileService = new CreateFileService(
      fakeFilesRepository,
      fakeFoldersRepository,
      fakeStorageProvider,
      fakeCacheProvider,
      connection
    );
  });


  it('should create a new file successfully', async () => {
    const folder = await fakeFoldersRepository.create({
      name: 'Test',
      slug: 'test',
    });

    const payload = {
      folder_id: folder.id,
      files: [
        { file: 'file1.png', name: 'Image 1' },
        { file: 'file2.png', name: 'Image 2' },
      ],
    };

    const response = await createFileService.execute(payload);

    expect(response.code).toBe(201);
    expect(response.message_code).toBe('CREATED');

    expect(response.data.length).toBe(2);


    expect(queryRunner.commitTransaction).toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalled();
  });


  it('should throw if folder does not exist', async () => {
    await expect(
      createFileService.execute({
        folder_id: 'invalid-folder',
        files: [{ file: 'test.png', name: 'Test File' }],
      })
    ).rejects.toBeInstanceOf(AppError);

    expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalled();
  });

  // ----------------------------------------------------------------------

  it('should call saveFile for each file', async () => {
    const spy = jest.spyOn(fakeStorageProvider, 'saveFile');

    const folder = await fakeFoldersRepository.create({
      name: 'Folder',
      slug: 'folder',
    });

    await createFileService.execute({
      folder_id: folder.id,
      files: [
        { file: 'a.png', name: 'A' },
        { file: 'b.png', name: 'B' },
      ],
    });

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenCalledWith('a.png');
    expect(spy).toHaveBeenCalledWith('b.png');
  });

  // ----------------------------------------------------------------------

  it('should rollback on unexpected error', async () => {
    const folder = await fakeFoldersRepository.create({
      name: 'Folder',
      slug: 'folder',
    });

    // Forçar erro na criação
    jest.spyOn(fakeFilesRepository, 'createMany').mockImplementation(() => {
      throw new Error('Unexpected');
    });

    await expect(
      createFileService.execute({
        folder_id: folder.id,
        files: [{ file: 'test.png', name: 'Test' }],
      })
    ).rejects.toThrow('Unexpected');

    expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
  });

});
