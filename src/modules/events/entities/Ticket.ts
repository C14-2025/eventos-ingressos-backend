import { Event} from '@modules/events/entities/Event';
import { Base } from '@shared/container/modules/entities/Base';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';


@Entity('tickets')
export class Ticket extends Base {
  @Column({ type: 'uuid'})
  public event_id: string;

  @ManyToOne(() => Event, event => event.tickets)
  @JoinColumn({ name: 'event_id' }) 
  public event: Event
}
