import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { Connection, IConnection } from '@shared/typeorm';
import { FakeDataSource } from '@shared/typeorm/dataSources/fakes/fakeDataSource';
import { FakeFilesRepository } from '@modules/system/repositories/fakes/FakeFilesRepository';
import { IEventsRepository } from '@modules/events/repositories/IEventsRepository';
import { FakeEventsRepository } from '@modules/events/repositories/fakes/FakeEventsRepository';
import { IFilesRepositoryDTO } from '@modules/system/repositories/IFilesRepository';
import { UpdateEventService } from './UpdateEventService';
import { AppError } from '@shared/errors/AppError';
import { CreateEventService } from '../createEvent/CreateEventService';

let fakeCacheProvider: ICacheProvider;
let fakeEventsRepository: IEventsRepository;
let fakeFilesRepository: IFilesRepositoryDTO;
let createEventService: CreateEventService;
let updateEventService: UpdateEventService;
let connection: IConnection;

describe('UpdateEventService.spec', (): void => {
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

    updateEventService = new UpdateEventService(
      fakeEventsRepository,
      fakeCacheProvider,
      fakeFilesRepository,
      connection,
    );
  });

  it('should be able to update event successfully', async (): Promise<void> => {
    const event = await fakeEventsRepository.create({
      title: 'Old Event',
      date: '2025-09-20',
      time: '10:00',
    });

    const response = await updateEventService.execute({
      title: 'Updated Event',
      date: '2025-09-21',
      time: '12:00',
    }, event.id);

    expect(response.code).toBe(201);
    expect(response.data.title).toBe('Updated Event');
    expect(response.data.date).toBe('2025-09-21');
    expect(response.data.time).toBe('12:00');
  });

  it('should not update a non-existing event', async (): Promise<void> => {
    await expect(updateEventService.execute({
      title: 'Test',
      date: '2025-09-20',
      time: '10:00',
    }, 'non-existing-id')).rejects.toBeInstanceOf(AppError);
  });

  it('should not update an event if another exists at the same date and time', async (): Promise<void> => {
    const eventData = {
      title: 'Event 1',
      date: '2025-09-20',
      time: '18:00',
    };

    await createEventService.execute(eventData);

    const { data } = await createEventService.execute({
      title: 'Other',
      date: '2025-09-21',
      time: '18:00',
    });

    const originalFindBy = fakeEventsRepository.findBy.bind(fakeEventsRepository);

    jest.spyOn(fakeEventsRepository, 'findBy').mockImplementation(async (query: any) => {
      const where = Array.isArray(query.where) ? query.where[0] : query.where;

      if (where?.date === eventData.date) {
        return {
          id: 'duplicate-id',
          date: eventData.date,
          time: eventData.time,
        } as any;
      }

      return originalFindBy(query);
    });

    await expect(updateEventService.execute(eventData as any, data.id)).rejects.toThrow(
      'Cannot create event, there is a event at the same time',
    );
  });



  it('should not update event with invalid file_id', async (): Promise<void> => {
    const event = await fakeEventsRepository.create({
      title: 'Event',
      date: '2025-09-20',
      time: '18:00',
    });

    await expect(updateEventService.execute({
      file_id: 'invalid-file-id',
      date: '2025-09-20',
      time: '18:00',
    }, event.id)).rejects.toThrow('File not found');
  });

  //   const event = await fakeEventsRepository.create({
  //     title: 'Event',
  //     date: '2025-09-20',
  //     time: '18:00',
  //   });

  //   // Forçar erro interno
  //   jest.spyOn(fakeEventsRepository, 'update').mockImplementation(async () => {
  //     throw new Error('forced-internal-error');
  //   });

  //   const trx = connection.mysql.createQueryRunner();
  //   const rollbackSpy = jest.spyOn(trx, 'rollbackTransaction');
  //   const releaseSpy = jest.spyOn(trx, 'release');

  //   await expect(updateEventService.execute({
  //     title: 'Fail Update',
  //     date: '2025-09-21',
  //     time: '11:00',
  //   }, event.id)).rejects.toThrow('forced-internal-error');

  //   expect(rollbackSpy).toHaveBeenCalled();
  //   expect(releaseSpy).toHaveBeenCalled();
  // });
});
