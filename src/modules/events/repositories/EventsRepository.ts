import { Event } from '@modules/events/entities/Event';
import { BaseRepository } from '@shared/container/modules/repositories/BaseRepository';
import { IEventsRepository } from './IEventsRepository';

export class EventsRepository
  extends BaseRepository<Event>
  implements IEventsRepository
{
  public constructor() {
    super(Event);
  }

  // non-generic methods here
}
