import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { Event } from '@modules/events/entities/Event';
import { UpdateEventService } from './UpdateEventService';
import { IEventDTO } from '@modules/events/dtos/IEventDTO';

export class UpdateEventController {
  public async handle(
    request: Request<IEventDTO, never, IEventDTO>,
    response: Response<IResponseDTO<Event>>,
  ) {
    const updateEvent = container.resolve(UpdateEventService);

    const eventData = request.body;

    const { id } = request.params;


    const event = await updateEvent.execute(eventData, id);

    return response.status(event.code).send(event);
  }
}
