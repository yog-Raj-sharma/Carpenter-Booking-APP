import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Carpenter } from '../carpenters/carpenter.entity';

@Entity({name: 'slots' })
export class Slot {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Carpenter, (carpenter) => carpenter.slots)
  carpenter: Carpenter;

  @Column()
  start_time: string;  

  @Column({ type: 'date' })
  dates: string;  

  @Column({ default: 'available' })
  status: string;  
}

