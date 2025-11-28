import { injectable, inject } from 'tsyringe';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { instanceToInstance } from 'class-transformer';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IConnection } from '@shared/typeorm';
import { AppError } from '@shared/errors/AppError';
import { updateAttribute } from '@utils/mappers';
import { ITicketDTO } from '@modules/events/dtos/ITicketDTO';
import { Ticket } from '@modules/events/entities/Ticket';
import { ITicketsRepository } from '@modules/events/repositories/ITicketsRepository';

@injectable()
export class UpdateTicketService {
  public constructor(
    @inject('TicketsRepository')
    private readonly ticketsRepository: ITicketsRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,

    @inject('Connection')
    private readonly connection: IConnection,
  ) { }


  public async execute(
    ticketData: ITicketDTO,
    id?: string
  ): Promise<IResponseDTO<Ticket>> {
    const trx = this.connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {

      const ticket = await this.ticketsRepository.findBy({ where: { id } }, trx)

      if (!ticket) {
        throw new AppError('NOT_FOUND', 'Ticket not found', 404);
      }


      await this.ticketsRepository.update(
        updateAttribute(ticket, ticketData),
        trx,
      );

      await this.cacheProvider.invalidatePrefix(
        `${this.connection.client}:events`,
      );
      await this.cacheProvider.invalidatePrefix(
        `${this.connection.client}:tickets`,
      );

      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 201,
        message_code: 'CREATED',
        message: 'Ticket successfully created',
        data: instanceToInstance(ticket),
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
