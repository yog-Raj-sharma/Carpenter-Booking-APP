import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Carpenter } from '../carpenters/carpenter.entity';

@Entity({name: 'slots' })
export class Slot {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Carpenter, (carpenter) => carpenter.slots)
  carpenter: Carpenter;

  @Column()
  start_time: string;  // Example: "09:00", "10:00", etc.

  @Column({ type: 'date' })
  dates: string;  // Make sure this is correctly typed

  @Column({ default: 'available' })
  status: string;  // "available" or "booked"
}

