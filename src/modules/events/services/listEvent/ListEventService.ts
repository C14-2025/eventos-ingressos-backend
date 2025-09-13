import { injectable, inject } from 'tsyringe';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { instanceToInstance } from 'class-transformer';
import { ICacheDTO } from '@dtos/ICacheDTO';
import { IListDTO } from '@dtos/IListDTO';
import { IConnection } from '@shared/typeorm';
import { FindOptionsWhere } from 'typeorm';
import { Event } from '@modules/events/entities/Event';
import { IEventsRepository } from '@modules/events/repositories/IEventsRepository';

@injectable()
export class ListEventService {
  public constructor(
    @inject('EventsRepository')
    private readonly eventsRepository: IEventsRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,

    @inject('Connection')
    private readonly connection: IConnection,
  ) {}

  public async execute(
    page: number,
    limit: number,
    filters: FindOptionsWhere<Event>,
  ): Promise<IListDTO<Event>> {
    const trx = this.connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const cacheKey = `${
        this.connection.client
      }:events:${page}:${limit}:${JSON.stringify(filters)}`;

      let cache = await this.cacheProvider.recovery<ICacheDTO<Event>>(cacheKey);

      if (!cache) {
        const { list, amount } = await this.eventsRepository.findAll(
          { where: filters, page, limit, relations: {tickets: true} },
          trx,
        );
        cache = { data: instanceToInstance(list), total: amount };
        await this.cacheProvider.save(cacheKey, cache);
      }

      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        message_code: 'LISTED',
        message: 'Successfully listed events',
        pagination: {
          total: cache.total,
          page,
          perPage: limit,
          lastPage: Math.ceil(cache.total / limit),
        },
        data: cache.data,
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
