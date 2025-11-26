import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { UpdateTicketService } from './UpdateTicketService';
import { ITicketDTO } from '@modules/events/dtos/ITicketDTO';
import { Ticket } from '@modules/events/entities/Ticket';

export class UpdateTicketController {
  public async handle(
    request: Request<ITicketDTO, never, ITicketDTO>,
    response: Response<IResponseDTO<Ticket>>,
  ) {
    const updateTicket = container.resolve(UpdateTicketService);

    const ticketData = request.body;

    const { id } = request.params;

    const event = await updateTicket.execute(ticketData, id);

    return response.status(event.code).send(event);
  }
}
