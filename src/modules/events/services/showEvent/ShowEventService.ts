import { injectable, inject } from 'tsyringe';
import { AppError } from '@shared/errors/AppError';
import { instanceToInstance } from 'class-transformer';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IConnection } from '@shared/typeorm';
import { IEventsRepository } from '@modules/events/repositories/IEventsRepository';
import { Event } from '@modules/events/entities/Event';

@injectable()
export class ShowEventService {
  public constructor(
    @inject('EventsRepository')
    private readonly eventsRepository: IEventsRepository,

    @inject('Connection')
    private readonly connection: IConnection,
  ) { }

  public async execute(id?: string): Promise<IResponseDTO<Event>> {
    const trx = this.connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {

      const event = await this.eventsRepository.findBy(
        { where: { id }, relations: { tickets: true, file: true } },
        trx,
      );

      if (!event) {
        throw new AppError('NOT_FOUND', 'Event not found', 404);
      }

      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        message_code: 'FOUND',
        message: 'Event found successfully',
        data: instanceToInstance(event),
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
