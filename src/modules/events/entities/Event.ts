import { User } from '@modules/users/entities/User';
import { Base } from '@shared/container/modules/entities/Base';
import {
  Column,
  Entity,
  OneToMany,
} from 'typeorm';
import { Ticket } from './Ticket';


@Entity('events')
export class Event extends Base {
  @Column({ type: 'varchar', nullable: false })
  public name: string;

  @Column({ type: 'varchar', nullable: false })
  public date: string;

  @Column({ type: 'varchar', nullable: false })
  public time: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  public capacity: number;

  @Column({ type: 'float', nullable: false, default: 0 })
  public ticket_price: number;

  @OneToMany(() => Ticket, ticket => ticket.event)
  public tickets: Array<Ticket>
}
