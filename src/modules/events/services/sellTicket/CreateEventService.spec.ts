import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { Connection, IConnection } from '@shared/typeorm';
import { FakeDataSource } from '@shared/typeorm/dataSources/fakes/fakeDataSource';
import { FakeFilesRepository } from '@shared/container/modules/system/repositories/fakes/FakeFilesRepository';

import { IEventsRepository } from '@modules/events/repositories/IEventsRepository';
import { FakeEventsRepository } from '@modules/events/repositories/fakes/FakeEventsRepository';
import { IEventDTO } from '@modules/events/dtos/IEventDTO';
import { IFilesRepositoryDTO } from '@modules/system/repositories/IFilesRepository';
import { FakeTicketsRepository } from '@modules/events/repositories/fakes/FakeTicketsRepository';
import { ITicketsRepository } from '@modules/events/repositories/ITicketsRepository';
import { SellTicketService } from './SellTicketService';

let fakeCacheProvider: ICacheProvider;
let fakeEventsRepository: IEventsRepository;
let fakeFilesRepository: IFilesRepositoryDTO;
let fakeTicketsRepository: ITicketsRepository;
let sellTicketService: SellTicketService;
let connection: IConnection;

describe('CreateUserService', (): void => {
  beforeAll((): void => {
    connection = new Connection('database', FakeDataSource);
  });

  beforeEach((): void => {
    fakeEventsRepository = new FakeEventsRepository();
    fakeTicketsRepository = new FakeTicketsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakeFilesRepository = new FakeFilesRepository();
    sellTicketService = new SellTicketService(
      fakeEventsRepository,
      fakeTicketsRepository,
      fakeCacheProvider,
      connection,
    );
  });

  it('should create a new event successfully', async (): Promise<void> => {});

