import { Event } from '@modules/events/entities/Event';
import { IBaseRepository } from '@shared/container/modules/repositories/IBaseRepository';

export interface IEventsRepository extends IBaseRepository<Event> {
  // non-generic methods here
}
