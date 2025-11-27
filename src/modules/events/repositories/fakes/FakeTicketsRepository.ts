import { FakeBaseRepository } from '@shared/container/modules/repositories/fakes/FakeBaseRepository';
import { Ticket } from '@modules/events/entities/Ticket';
import { ITicketsRepository } from '../ITicketsRepository';

export class FakeTicketsRepository
  extends FakeBaseRepository<Ticket>
  implements ITicketsRepository
{
  public constructor() {
    super(Ticket);

    // non-generic methods here
  }
}
