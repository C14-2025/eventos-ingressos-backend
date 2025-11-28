import { IConnection, Connection } from '@shared/typeorm';
import { FakeDataSource } from '@shared/typeorm/dataSources/fakes/fakeDataSource';
import { UpdateTicketService } from './UpdateTicketService';
import { ITicketsRepository } from '@modules/events/repositories/ITicketsRepository';
import { FakeTicketsRepository } from '@modules/events/repositories/fakes/FakeTicketsRepository';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { FakeCacheProvider } from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { AppError } from '@shared/errors/AppError';

let connection: IConnection;
let updateTicketService: UpdateTicketService;
let fakeTicketsRepository: ITicketsRepository;
let fakeCacheProvider: ICacheProvider;

describe('UpdateTicketService', (): void => {
  beforeAll((): void => {
    connection = new Connection('database', FakeDataSource);
  });

  beforeEach((): void => {
    fakeTicketsRepository = new FakeTicketsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    updateTicketService = new UpdateTicketService(
      fakeTicketsRepository,
      fakeCacheProvider,
      connection
    );
  });

  it('should be able to update a ticket', async (): Promise<void> => {
    const ticket = await fakeTicketsRepository.create({
      document: '12345678900',
      event_id: 'event123',
    });

    const updatedData = {
      document: '99999999999',
    };

    const response = await updateTicketService.execute(updatedData, ticket.id);

    expect(response.code).toBe(201);
    expect(response.data.document).toBe('99999999999');
  });

  it('should not update a non-existing ticket', async (): Promise<void> => {
    await expect(
      updateTicketService.execute(
        { document: '11111111111' },
        'non-existing-id'
      )
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should call cache invalidation after update', async (): Promise<void> => {
    const ticket = await fakeTicketsRepository.create({
      document: '12345678900',
      event_id: 'event123',
    });

    const invalidateSpy = jest.spyOn(fakeCacheProvider, 'invalidatePrefix');

    await updateTicketService.execute({ document: 'abc' }, ticket.id);

    expect(invalidateSpy).toHaveBeenCalledTimes(2);
    expect(invalidateSpy).toHaveBeenCalledWith('database:events');
    expect(invalidateSpy).toHaveBeenCalledWith('database:tickets');
  });

  it('should rollback and throw if update throws an error', async (): Promise<void> => {
    const ticket = await fakeTicketsRepository.create({
      document: '12345678900',
      event_id: 'event123',
    });

    // força erro no update
    jest
      .spyOn(fakeTicketsRepository, 'update')
      .mockImplementationOnce(() => {
        throw new Error('update error');
      });

    await expect(
      updateTicketService.execute({ document: 'aaa' }, ticket.id)
    ).rejects.toThrow('update error');
  });
});
