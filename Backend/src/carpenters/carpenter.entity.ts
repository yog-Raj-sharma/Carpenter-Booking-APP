import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Slot } from '../slots/slot.entity';

@Entity({ name: 'carpenters' }) 
export class Carpenter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false }) 
  name: string;

  @OneToMany(() => Slot, (slot) => slot.carpenter)
  slots: Slot[];
}
