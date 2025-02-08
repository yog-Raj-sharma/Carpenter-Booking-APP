import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Slot } from '../slots/slot.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @ManyToOne(() => Slot)
  @JoinColumn({ name: 'slotId' }) 
  slot: Slot;

  @Column()
  slotId: number; 
  @Column({ default: 'booked' })
  status: string; // "confirmed" or "canceled"
}
