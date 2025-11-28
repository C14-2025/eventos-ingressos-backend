import { IConnection, Connection } from '@shared/typeorm';
import { FakeDataSource } from '@shared/typeorm/dataSources/fakes/fakeDataSource';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { CreateUserService } from './CreateUserService';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository';
import { IHashProviderDTO } from '@shared/container/providers/HashProvider/models/IHashProvider';
import { FakeHashProvider } from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import { AppError } from '@shared/errors/AppError';

let connection: IConnection;
let createUserService: CreateUserService;
let fakeCacheProvider: ICacheProvider;
let fakeUsersRepository: IUsersRepository;
let fakeHashProvider: IHashProviderDTO;
let queryRunner: any;

describe('CreateUserService', () => {
  beforeAll(() => {
    connection = new Connection('database', FakeDataSource);
  });

  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakeHashProvider = new FakeHashProvider();

    queryRunner = {
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
      isTransactionActive: true,
      isReleased: false,
    };

    jest
      .spyOn(connection.mysql, 'createQueryRunner')
      .mockReturnValue(queryRunner);

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeCacheProvider,
      connection,
      fakeHashProvider,
    );
  });


  it('should be able to create a user', async () => {
    const response = await createUserService.execute({
      email: 'test@test.com',
      password: '123456',
      name: 'John Doe',
    });

    expect(response.code).toBe(201);
    expect(response.message_code).toBe('CREATED');
    expect(response.data).toHaveProperty('id');
    expect(response.data.email).toBe('test@test.com');
    expect(queryRunner.commitTransaction).toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalled();
  });


  it('should throw when email or password are blank', async () => {
    await expect(
      createUserService.execute({
        email: '',
        password: '',
        name: 'John',
      }),
    ).rejects.toBeInstanceOf(AppError);

    expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalled();
  });


  it('should not allow duplicated email', async () => {
    jest.spyOn(fakeUsersRepository, 'exists').mockResolvedValue(true);

    await expect(
      createUserService.execute({
        email: 'duplicado@test.com',
        password: '123456',
        name: 'User',
      }),
    ).rejects.toThrow('Email alerady exists');

    expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalled();
  });


  it('should hash password before creating user', async () => {
    const spyHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await createUserService.execute({
      email: 'test@test.com',
      password: '123456',
      name: 'Test',
    });

    expect(spyHash).toHaveBeenCalledWith('123456');
  });


  it('should call rollback on unexpected error', async () => {
    jest.spyOn(fakeUsersRepository, 'create').mockImplementation(() => {
      throw new Error('Unexpected');
    });

    await expect(
      createUserService.execute({
        email: 'a@a.com',
        password: '123',
        name: 'AAA',
      }),
    ).rejects.toThrow('Unexpected');

    expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    expect(queryRunner.release).toHaveBeenCalled();
  });
});
