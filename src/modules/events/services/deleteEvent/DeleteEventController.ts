import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { IResponseDTO } from '@dtos/IResponseDTO';
import { DeleteEventService } from './DeleteEventService';
import { IEventDTO } from '@modules/events/dtos/IEventDTO';

export class DeleteEventController {
  public async handle(
    request: Request<IEventDTO>,
    response: Response<IResponseDTO<null>>,
  ) {
    const deleteEvent = container.resolve(DeleteEventService);

    const { id } = request.params;

    const event = await deleteEvent.execute(id);

    return response.send(event);
  }
}
