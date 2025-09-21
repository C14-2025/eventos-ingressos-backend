import { CreateEventService } from './CreateEventService';
import { IEventsRepository } from '@modules/events/repositories/IEventsRepository';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { IEventDTO } from '@modules/events/dtos/IEventDTO';
import { IConnection } from '@shared/typeorm';

describe('CreateEventService with mocks', () => {
  let mockEventsRepository: jest.Mocked<IEventsRepository>;
  let mockCacheProvider: jest.Mocked<ICacheProvider>;
  let mockConnection: jest.Mocked<IConnection>;
  let createEventService: CreateEventService;

  beforeEach(() => {
    // Mocks do repositório e cache
    mockEventsRepository = {
      findByDateAndTime: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<IEventsRepository>;

    mockCacheProvider = {
      save: jest.fn(),
      recover: jest.fn(),
      invalidate: jest.fn(),
    } as unknown as jest.Mocked<ICacheProvider>;

    mockConnection = {
      queryRunner: undefined,
    } as unknown as jest.Mocked<IConnection>;

    createEventService = new CreateEventService(
      mockEventsRepository,
      mockCacheProvider,
      mockConnection
    );
  });

  it('should create a new event successfully', async () => {
    const eventData: IEventDTO = {
      name: 'Test Event',
      date: '2025-09-20',
      time: '18:00',
    };

    const createdEvent = { id: '1', ...eventData };
    mockEventsRepository.findByDateAndTime.mockResolvedValue(null); // não existe evento no mesmo horário
    mockEventsRepository.create.mockResolvedValue(createdEvent);

    const response = await createEventService.execute(eventData);

    expect(response.code).toBe(201);
    expect(response.message_code).toBe('CREATED');
    expect(response.data).toHaveProperty('id');
    expect(response.data.name).toBe('Test Event');
  });

  it('should not create an event if another exists at the same date and time', async () => {
    const eventData: IEventDTO = {
      name: 'Event 1',
      date: '2025-09-20',
      time: '18:00',
    };

    const existingEvent = { id: '1', ...eventData };
    mockEventsRepository.findByDateAndTime.mockResolvedValue(existingEvent);

    await expect(
      createEventService.execute(eventData)
    ).rejects.toThrow('Cannot create event, there is an event at the same time');
  });

  it('should allow creating two events on the same day but at different times', async () => {
    const eventData1: IEventDTO = {
      name: 'Morning Event',
      date: '2025-09-20',
      time: '10:00',
    };

    const eventData2: IEventDTO = {
      name: 'Evening Event',
      date: '2025-09-20',
      time: '18:00',
    };

    const createdEvent1 = { id: '1', ...eventData1 };
    const createdEvent2 = { id: '2', ...eventData2 };

    mockEventsRepository.findByDateAndTime
      .mockResolvedValueOnce(null) // primeira criação ok
      .mockResolvedValueOnce(null); // segunda criação ok

    mockEventsRepository.create
      .mockResolvedValueOnce(createdEvent1)
      .mockResolvedValueOnce(createdEvent2);

    const response1 = await createEventService.execute(eventData1);
    const response2 = await createEventService.execute(eventData2);

    expect(response1.code).toBe(201);
    expect(response2.code).toBe(201);
    expect(response1.data.time).not.toBe(response2.data.time);
  });

  it('should not allow two events at the same date and time even with different names', async () => {
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

    const existingEvent = { id: '1', ...eventData1 };
    mockEventsRepository.findByDateAndTime
      .mockResolvedValueOnce(null) // primeiro evento ok
      .mockResolvedValueOnce(existingEvent); // segundo evento encontra conflito

    mockEventsRepository.create.mockResolvedValue(existingEvent);

    await createEventService.execute(eventData1);

    await expect(
      createEventService.execute(eventData2)
    ).rejects.toThrow('Cannot create event, there is an event at the same time');
  });

  it('should cache the created event after successful creation', async () => {
    const eventData: IEventDTO = {
      name: 'Cached Event',
      date: '2025-09-22',
      time: '09:00',
    };

    const createdEvent = { id: '1', ...eventData };
    mockEventsRepository.findByDateAndTime.mockResolvedValue(null);
    mockEventsRepository.create.mockResolvedValue(createdEvent);

    const response = await createEventService.execute(eventData);

    expect(response.code).toBe(201);
    expect(mockCacheProvider.save).toHaveBeenCalledWith(
      `event:${createdEvent.id}`,
      createdEvent
    );
  });

  it('should return an object with the correct properties when an event is created', async () => {
    const eventData: IEventDTO = {
      name: 'Property Test Event',
      date: '2025-09-23',
      time: '15:00',
    };

    const createdEvent = { id: '1', ...eventData };
    mockEventsRepository.findByDateAndTime.mockResolvedValue(null);
    mockEventsRepository.create.mockResolvedValue(createdEvent);

    const response = await createEventService.execute(eventData);

    expect(response).toHaveProperty('code');
    expect(response).toHaveProperty('message_code');
    expect(response).toHaveProperty('data');
    expect(response.data).toHaveProperty('id');
    expect(response.data).toHaveProperty('name', 'Property Test Event');
  });

 
  it('should invalidate cache after creating a new event', async () => {
    const eventData: IEventDTO = {
      name: 'Invalidate Cache Event',
      date: '2025-09-24',
      time: '12:00',
    };

    const createdEvent = { id: '99', ...eventData };

    mockEventsRepository.findByDateAndTime.mockResolvedValue(null);
    mockEventsRepository.create.mockResolvedValue(createdEvent);

    const response = await createEventService.execute(eventData);

    expect(response.code).toBe(201);
    expect(mockCacheProvider.invalidate).toHaveBeenCalled();
  });
});
