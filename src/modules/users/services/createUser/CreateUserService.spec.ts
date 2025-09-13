import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { FakeUsersRepository } from '@modules/users/repositories/fakes/FakeUsersRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { Connection, IConnection } from '@shared/typeorm';
import { FakeDataSource } from '@shared/typeorm/dataSources/fakes/fakeDataSource';
import { CreateUserService } from './CreateUserService';
import { FakeHashProvider } from '@shared/container/providers/HashProvider/fakes/FakeHashProvider';
import { IHashProviderDTO } from '@shared/container/providers/HashProvider/models/IHashProvider';

let fakeUsersRepository: IUsersRepository;
let fakeCacheProvider: ICacheProvider;
let fakeHashProvider: IHashProviderDTO;
let connection: IConnection;
let createUserService: CreateUserService;

describe('CreateUserService', (): void => {
  beforeAll((): void => {
    connection = new Connection('database_test', FakeDataSource);
  });

  beforeEach((): void => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeCacheProvider,
      connection,
      fakeHashProvider,
    );
  });

});