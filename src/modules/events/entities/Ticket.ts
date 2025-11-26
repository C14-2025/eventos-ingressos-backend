import { Event } from '@modules/events/entities/Event';
import { Base } from '@shared/container/modules/entities/Base';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';

@Entity('tickets')
@Unique(['document', 'event_id'])
export class Ticket extends Base {
  @Column({ type: 'varchar', nullable: false })
  public document: string;

  @Column({ type: 'uuid', nullable: false })
  public event_id: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  public check: boolean;

  @ManyToOne(() => Event, event => event.tickets)
  @JoinColumn({ name: 'event_id' })
  public event: Event
}
