import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { Event } from '@modules/events/entities/Event';
import { CreateEventService } from './CreateEventService';
import { IEventDTO } from '@modules/events/dtos/IEventDTO';

export class CreateEventController {
  public async handle(
    request: Request<never, never, IEventDTO>,
    response: Response<IResponseDTO<Event>>,
  ) {
    const financeData = request.body;

    const createEvent = container.resolve(CreateEventService);

    const event = await createEvent.execute(financeData);

    return response.status(event.code).send(event);
  }
}
