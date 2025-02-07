import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Slot } from '../slots/slot.entity';

@Entity({ name: 'carpenters' }) //  Explicitly set table name
export class Carpenter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false }) // Ensure name is always required
  name: string;

  @OneToMany(() => Slot, (slot) => slot.carpenter)
  slots: Slot[];
}
