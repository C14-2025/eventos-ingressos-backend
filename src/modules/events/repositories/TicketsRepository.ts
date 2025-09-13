import { BaseRepository } from '@shared/container/modules/repositories/BaseRepository';
import { ITicketsRepository } from './ITicketsRepository';
import { Ticket } from '../entities/Ticket';

export class TicketsRepository
  extends BaseRepository<Ticket>
  implements ITicketsRepository
{
  public constructor() {
    super(Ticket);
  }

  // non-generic methods here
}
