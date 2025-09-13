import { IBaseRepository } from '@shared/container/modules/repositories/IBaseRepository';
import { Ticket } from '../entities/Ticket';

export interface ITicketsRepository extends IBaseRepository<Ticket> {
  // non-generic methods here
}
