import { injectable, inject } from 'tsyringe';
import { AppError } from '@shared/errors/AppError';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IConnection } from '@shared/typeorm';
import { IEventsRepository } from '@modules/events/repositories/IEventsRepository';

@injectable()
export class DeleteEventService {
  public constructor(
    @inject('EventsRepository')
    private readonly eventsRepository: IEventsRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,

    @inject('Connection')
    private readonly connection: IConnection,
  ) { }

  public async execute(id?: string): Promise<IResponseDTO<null>> {
    const trx = this.connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const user = await this.eventsRepository.exists(
        { where: { id } },
        trx,
      );

      if (!user) {
        throw new AppError('NOT_FOUND', 'Event not found', 404);
      }

      await this.eventsRepository.delete({ id }, trx);

      await this.cacheProvider.invalidatePrefix(
        `${this.connection.client}:events`,
      );
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 204,
        message_code: 'DELETED',
        message: 'Successfully deleted Event',
        data: null,
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
