import { User } from '@modules/users/entities/User';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { IUserDTO } from '@modules/users/dtos/IUserDTO';
import { ShowEventService } from './ShowEventService';
import { IEventDTO } from '@modules/events/dtos/IEventDTO';
import { Event } from '@modules/events/entities/Event';

export class ShowEventController {
  public async handle(
    request: Request<IEventDTO>,
    response: Response<IResponseDTO<Event>>,
  ) {
    const showEvent = container.resolve(ShowEventService);

    const { id } = request.params;

    const event = await showEvent.execute(id);

    return response.status(event.code).send(event);
  }
}
