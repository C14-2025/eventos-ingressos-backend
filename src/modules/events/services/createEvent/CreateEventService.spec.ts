import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { Connection, IConnection } from '@shared/typeorm';
import { FakeDataSource } from '@shared/typeorm/dataSources/fakes/fakeDataSource';
import { CreateEventService } from './CreateEventService';
import { IEventsRepository } from '@modules/events/repositories/IEventsRepository';
import { FakeEventsRepository } from '@modules/events/repositories/fakes/FakeEventsRepository';
import { IEventDTO } from '@modules/events/dtos/IEventDTO';

let fakeCacheProvider: ICacheProvider;
let fakeEventsRepository: IEventsRepository;
let createEventService: CreateEventService;
let connection: IConnection;

describe('CreateUserService', (): void => {
  beforeAll((): void => {
    connection = new Connection('database_test', FakeDataSource);
  });

  beforeEach((): void => {
    fakeEventsRepository = new FakeEventsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createEventService = new CreateEventService(
      fakeEventsRepository,
      fakeCacheProvider,
      connection
    );
  });

  it('should create a new event successfully', async (): Promise<void> => {
    const eventData: IEventDTO = {
      name: 'Test Event',
      date: '2025-09-20',
      time: '18:00',
    };

    const response = await createEventService.execute(eventData);

    expect(response.code).toBe(201);
    expect(response.message_code).toBe('CREATED');
    expect(response.data).toHaveProperty('id');
    expect(response.data.name).toBe('Test Event');
  });

  it('should not create an event if another exists at the same date and time', async (): Promise<void> => {
    const eventData: IEventDTO = {
      name: 'Event 1',
      date: '2025-09-20',
      time: '18:00',
    } as IEventDTO;

    await createEventService.execute(eventData);

    await expect(
      createEventService.execute(eventData),
    ).rejects.toThrow('Cannot create event, there is a event at the same time');
  });

  it('should allow creating two events on the same day but at different times', async (): Promise<void> => {
    const eventData1: IEventDTO = {
      name: 'Morning Event',
      date: '2025-09-20',
      time: '10:00',
    } as IEventDTO;

    const eventData2: IEventDTO = {
      name: 'Evening Event',
      date: '2025-09-20',
      time: '18:00',
    } as IEventDTO;

    const response1 = await createEventService.execute(eventData1);
    const response2 = await createEventService.execute(eventData2);

    expect(response1.code).toBe(201);
    expect(response2.code).toBe(201);
    expect(response1.data.time).not.toBe(response2.data.time);
  });

  it('should not allow two events at the same date and time even with different names', async (): Promise<void> => {
    const eventData1: IEventDTO = {
      name: 'Event Alpha',
      date: '2025-09-21',
      time: '20:00',
    };

    const eventData2: IEventDTO = {
      name: 'Event Beta',
      date: '2025-09-21',
      time: '20:00',
    };

    await createEventService.execute(eventData1);

    await expect(
      createEventService.execute(eventData2),
    ).rejects.toThrow('Cannot create event, there is a event at the same time');
  });

  it('should cache the created event after successful creation', async (): Promise<void> => {
    const eventData: IEventDTO = {
      name: 'Cached Event',
      date: '2025-09-22',
      time: '09:00',
    };

    const cacheSpy = jest.spyOn(fakeCacheProvider, 'save');

    const response = await createEventService.execute(eventData);

    expect(response.code).toBe(201);
    expect(cacheSpy).toHaveBeenCalled();
  });

  it('should return an object with the correct properties when an event is created', async (): Promise<void> => {
    const eventData: IEventDTO = {
      name: 'Property Test Event',
      date: '2025-09-23',
      time: '15:00',
    };

    const response = await createEventService.execute(eventData);

    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message_code');
    expect(response).toHaveProperty('data');
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('name', 'Property Test Event');
  });
});