import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { Connection, IConnection } from '@shared/typeorm';
import { FakeDataSource } from '@shared/typeorm/dataSources/fakes/fakeDataSource';


import { IEventsRepository } from '@modules/events/repositories/IEventsRepository';
import { FakeEventsRepository } from '@modules/events/repositories/fakes/FakeEventsRepository';
import { IEventDTO } from '@modules/events/dtos/IEventDTO';
import { IFilesRepositoryDTO } from '@modules/system/repositories/IFilesRepository';
import { CreateEventService } from './CreateEventService';
import { FakeFilesRepository } from '@modules/system/repositories/fakes/FakeFilesRepository';

let fakeCacheProvider: ICacheProvider;
let fakeEventsRepository: IEventsRepository;
let fakeFilesRepository: IFilesRepositoryDTO;
let createEventService: CreateEventService;
let connection: IConnection;

describe('CreateUserService', (): void => {
  beforeAll((): void => {
    connection = new Connection('database', FakeDataSource);
  });

  beforeEach((): void => {
    fakeEventsRepository = new FakeEventsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    fakeFilesRepository = new FakeFilesRepository();
    createEventService = new CreateEventService(
      fakeEventsRepository,
      fakeCacheProvider,
      fakeFilesRepository,
      connection,
    );
  });

  it('should create a new event successfully', async (): Promise<void> => {
    const file = await fakeFilesRepository.create({ folder_id: '123' });

    const eventData: IEventDTO = {
      title: 'Test Event',
      date: '2025-09-20',
      file_id: file.id,
      time: '18:00',
    };

    const response = await createEventService.execute(eventData);

    expect(response.code).toBe(201);
    expect(response.message_code).toBe('CREATED');
    expect(response.data).toHaveProperty('id');
    expect(response.data.title).toBe('Test Event');
  });

  it('should not create a new event with a wrong file_id', async (): Promise<void> => {
    const eventData: IEventDTO = {
      title: 'Test Event',
      file_id: '123',
      date: '2025-09-20',
      time: '18:00',
    };
    await expect(createEventService.execute(eventData)).rejects.toThrow(
      'File not found',
    );
  });

  it('should not create an event if another exists at the same date and time', async (): Promise<void> => {
    const eventData: IEventDTO = {
      title: 'Event 1',
      date: '2025-09-20',
      time: '18:00',
    } as IEventDTO;

    await createEventService.execute(eventData);

    await expect(createEventService.execute(eventData)).rejects.toThrow(
      'Cannot create event, there is a event at the same time',
    );
  });

  it('should allow creating two events on the same day but at different times', async (): Promise<void> => {
    const eventData1: IEventDTO = {
      title: 'Morning Event',
      date: '2025-09-20',
      time: '10:00',
    } as IEventDTO;

    const eventData2: IEventDTO = {
      title: 'Evening Event',
      date: '2025-09-20',
      time: '18:00',
    } as IEventDTO;

    const response1 = await createEventService.execute(eventData1);
    const response2 = await createEventService.execute(eventData2);

    expect(response1.code).toBe(201);
    expect(response2.code).toBe(201);
    expect(response1.data.time).not.toBe(response2.data.time);
  });
});