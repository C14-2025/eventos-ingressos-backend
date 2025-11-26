import { Base } from '@shared/container/modules/entities/Base';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Ticket } from './Ticket';
import { File } from '@modules/system/entities/File';

@Entity('events')
export class Event extends Base {
  @Column({ type: 'varchar', nullable: false })
  public title: string;

  @Column({ type: 'varchar', nullable: false })
  public description: string;

  @Column({ type: 'varchar', nullable: false })
  public date: string;

  @Column({ type: 'varchar', nullable: false })
  public time: string;

  @Column({ type: 'int', nullable: false, default: 0 })
  public capacity: number;

  @Column({ type: 'float', nullable: false, default: 0 })
  public price: number;

  @Column({ type: 'varchar', nullable: true })
  public file_id: string;

  @OneToOne(() => File)
  @JoinColumn({
    name: 'file_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_file_product',
  })
  public file: File

  @OneToMany(() => Ticket, ticket => ticket.event)
  public tickets: Array<Ticket>

}
