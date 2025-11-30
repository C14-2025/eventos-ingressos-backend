import { injectable, inject } from 'tsyringe';
import { AppError } from '@shared/errors/AppError';
import { instanceToInstance } from 'class-transformer';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IConnection } from '@shared/typeorm';
import { ITicketsRepository } from '@modules/events/repositories/ITicketsRepository';
import { Ticket } from '@modules/events/entities/Ticket';
import QRCode from 'qrcode';
import { IListDTO } from '@dtos/IListDTO';

@injectable()
export class ShowTicketService {
  public constructor(
    @inject('TicketsRepository')
    private readonly ticketsRepository: ITicketsRepository,

    @inject('Connection')
    private readonly connection: IConnection,
  ) { }

  public async execute(document?: string): Promise<IListDTO<Ticket & { qrCode: string }>> {
    const trx = this.connection.mysql.createQueryRunner();

    await trx.startTransaction();
    try {

      const { list, amount } = await this.ticketsRepository.findAll(
        { where: { document }, relations: { event: true } },
        trx,
      );

      let array: Array<Ticket & { qrCode: string }> = []
      if (list.length) {
        const promises = list.map(async ticket => {

          const qrCodeBase64 = await QRCode.toDataURL(ticket.id, { margin: 2, width: 300, errorCorrectionLevel: "M" });

          return {
            ...ticket,
            qrCode: qrCodeBase64
          }
        })

        array = await Promise.all(promises)

      }


      if (trx.isTransactionActive) await trx.commitTransaction();

      return {
        code: 200,
        message_code: 'LISTED',
        message: 'Successfully listed tickets',
        pagination: {
          total: amount,
          page: 1,
          perPage: list.length,
          lastPage: 0,
        },
        data: instanceToInstance(array)
      }
    } catch (error: unknown) {
      if (trx.isTransactionActive) await trx.rollbackTransaction();
      throw error;
    } finally {
      if (!trx.isReleased) await trx.release();
    }
  }
}
