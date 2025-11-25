import { injectable, inject } from 'tsyringe';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { Event } from '@modules/events/entities/Event';
import { instanceToInstance } from 'class-transformer';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IConnection } from '@shared/typeorm';
import { IEventsRepository } from '@modules/events/repositories/IEventsRepository';
import { IEventDTO } from '@modules/events/dtos/IEventDTO';
import { AppError } from '@shared/errors/AppError';
import { IFilesRepositoryDTO } from '@modules/system/repositories/IFilesRepository';
import { Not } from 'typeorm';
import { updateAttribute } from '@utils/mappers';

@injectable()
export class UpdateEventService {
  public constructor(
    @inject('EventsRepository')
    private readonly eventsRepository: IEventsRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,

    @inject('FilesRepository')
    private readonly filesRepository: IFilesRepositoryDTO,

    @inject('Connection')
    private readonly connection: IConnection,
  ) { }


  public async execute(
    eventData: IEventDTO,
    id?: string
  ): Promise<IResponseDTO<Event>> {
    const trx = this.connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {

      const evvent = await this.eventsRepository.findBy({ where: { id } }, trx)

      if (!evvent) {
        throw new AppError('NOT_FOUND', 'Event not found', 404);
      }

      const eventWithSameDate = await this.eventsRepository.findBy({ where: { id: Not(id as string), date: eventData.date } }, trx)

      if (eventWithSameDate) {
        const isSameTime = eventWithSameDate.time === eventData.time

        if (isSameTime) {
          throw new AppError('BAD_REQUEST', 'Cannot create event, there is a event at the same time', 400)
        }
      }

      if (eventData?.file_id) {
        const file = await this.filesRepository.exists({ where: { id: eventData.file_id } }, trx)

        if (!file) {
          throw new AppError('BAD_REQUEST', 'File not found', 404)
        }
      }

      await this.eventsRepository.update(
        updateAttribute(evvent, eventData),
        trx,
      );

      await this.cacheProvider.invalidatePrefix(
        `${this.connection.client}:events`,
      );
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 201,
        message_code: 'CREATED',
        message: 'Event successfully created',
        data: instanceToInstance(evvent),
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
