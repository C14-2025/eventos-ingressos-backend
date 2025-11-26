import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ShowTicketService } from './ShowTicketService';
import { ITicketDTO } from '@modules/events/dtos/ITicketDTO';
import { Ticket } from '@modules/events/entities/Ticket';
import { IListDTO } from '@dtos/IListDTO';

export class ShowTicketController {
  public async handle(
    request: Request<ITicketDTO>,
    response: Response<IListDTO<Ticket>>,
  ) {
    const showTicket = container.resolve(ShowTicketService);

    const { document } = request.params;

    const ticket = await showTicket.execute(document);

    return response.status(ticket.code).send(ticket);
  }
}
