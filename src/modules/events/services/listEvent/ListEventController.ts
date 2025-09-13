import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { FindOptionsWhere } from 'typeorm';
import { IListDTO } from '@dtos/IListDTO';
import { Event } from '@modules/events/entities/Event';
import { ListEventService } from './ListEventService';

export class ListEventController {
  public async handle(
    request: Request<
      never,
      never,
      never,
      { page: number; limit: number } & FindOptionsWhere<Event>
    >,
    response: Response<IListDTO<Event>>,
  ) {
    const listShare = container.resolve(ListEventService);

    const { page = 1, limit = 20, ...filters } = request.query;

    const shares = await listShare.execute(
      page,
      limit,
      filters,
    );

    return response.status(shares.code).send(shares);
  }
}
