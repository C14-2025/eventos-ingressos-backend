import { injectable, inject } from 'tsyringe';
import QRCode from 'qrcode';
import { ICacheProvider } from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { instanceToInstance } from 'class-transformer';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IConnection } from '@shared/typeorm';
import { IEventsRepository } from '@modules/events/repositories/IEventsRepository';
import { AppError } from '@shared/errors/AppError';
import { ITicketsRepository } from '@modules/events/repositories/ITicketsRepository';
import { ITicketDTO } from '@modules/events/dtos/ITicketDTO';
import { Ticket } from '@modules/events/entities/Ticket';

@injectable()
export class SellTicketService {
  public constructor(
    @inject('EventsRepository')
    private readonly eventsRepository: IEventsRepository,

    @inject('TicketsRepository')
    private readonly ticketsRepository: ITicketsRepository,

    @inject('CacheProvider')
    private readonly cacheProvider: ICacheProvider,

    @inject('Connection')
    private readonly connection: IConnection,
  ) { }

  public async execute(
    ticketData: ITicketDTO,
  ): Promise<IResponseDTO<Ticket & { qrCode: string }>> {
    const trx = this.connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {
      const event = await this.eventsRepository.findBy(
        { where: { id: ticketData.event_id } },
        trx,
      );

      if (!event) {
        throw new AppError('BAD_REQUEST', 'No event for this ticket', 404);
      }

      const { amount } = await this.ticketsRepository.findAll(
        { where: { event_id: ticketData.event_id } },
        trx,
      );


      if (amount >= event.capacity) {
        throw new AppError(
          'BAD_REQUEST',
          'No more tickets for this event',
          400,
        );
      }

      const ticketAlreadyBought = await this.ticketsRepository.exists(
        {
          where: {
            document: ticketData.document,
            event_id: ticketData.event_id,
          },
        },
        trx,
      );

      if (ticketAlreadyBought) {
        throw new AppError('BAD_REQUEST', 'Just one ticket per person', 400);
      }

      const ticket = await this.ticketsRepository.create(ticketData, trx);

      const ticketId = ticket.id

      console.log("TICKET GERADO:", ticket);
      console.log("ID DO TICKET:", ticket.id, typeof ticket.id);


      const qrCodeBase64 = await QRCode.toDataURL(ticketId, { margin: 2, width: 300, errorCorrectionLevel: "M" });

      await this.cacheProvider.invalidatePrefix(
        `${this.connection.client}:tickets`,
      );
      await this.cacheProvider.invalidatePrefix(
        `${this.connection.client}:events`,
      );
      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 201,
        message_code: 'CREATED',
        message: 'Ticket successfully selled',
        data: { ...instanceToInstance(ticket), qrCode: qrCodeBase64 },
      };
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
