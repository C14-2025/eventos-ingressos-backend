import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { Ticket } from '@modules/events/entities/Ticket';
import { SellTicketService } from './SellTicketService';
import { ITicketDTO } from '@modules/events/dtos/ITicketDTO';

export class SellTicketController {
  public async handle(
    request: Request<never, never, ITicketDTO>,
    response: Response<IResponseDTO<Ticket>>,
  ) {
    const ticketData = request.body;

    const createEvent = container.resolve(SellTicketService);

    const ticket = await createEvent.execute(ticketData);

    return response.status(ticket.code).send(ticket);
  }
}
