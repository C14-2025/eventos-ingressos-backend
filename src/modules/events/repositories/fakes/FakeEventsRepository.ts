import { Event } from '@modules/events/entities/Event';
import { FakeBaseRepository } from '@shared/container/modules/repositories/fakes/FakeBaseRepository';
import { IEventsRepository } from '../IEventsRepository';

export class FakeEventsRepository
  extends FakeBaseRepository<Event>
  implements IEventsRepository
{
  public constructor() {
    super(Event);

  // non-generic methods here
}
}
