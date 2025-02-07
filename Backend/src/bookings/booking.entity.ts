import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Slot } from '../slots/slot.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => Slot)
  slot: Slot;

  @Column({ default: 'booked' })
  status: string; // "confirmed" or "canceled"
}
 