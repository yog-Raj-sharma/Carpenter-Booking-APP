import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slot } from './slot.entity';
import { Carpenter } from '../carpenters/carpenter.entity';

@Injectable()
export class SlotService implements OnModuleInit {
  constructor(
    @InjectRepository(Slot)
    private slotRepository: Repository<Slot>,
    @InjectRepository(Carpenter)
    private carpenterRepository: Repository<Carpenter>,
    @InjectRepository(Slot) private slotRepo: Repository<Slot>,
  ) {}

  
async getAvailableSlots(): Promise<any> {
  const rawQuery = await this.slotRepository.query('SELECT * FROM slots'); 
  //console.log('Raw Query Result:', JSON.stringify(rawQuery, null, 2)); 
  return rawQuery;
}

 async onModuleInit() {
    await this.generateSlots();
  }

  async generateSlots() { 
  const today = new Date();

  // Get next 5 consecutive dates
  const dates = Array.from({ length: 5 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
  });

  // Fetch all carpenters
  const carpenters = await this.carpenterRepository.find();

  const startTimes = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  for (const carpenter of carpenters) {
    for (const date of dates) { 
      for (const time of startTimes) {
        const existingSlot = await this.slotRepository.findOne({
          where: { carpenter, start_time: time, dates: date },  
        });

        if (!existingSlot) {
          await this.slotRepository.save({
            carpenter,
            start_time: time,
            dates: date,  
            status: 'available',
          });
        }
      }
    }
  }
}

async confirmSlot(slotId: number): Promise<Slot> {
    const slot = await this.slotRepo.findOne({ where: { id: slotId } });

    if (!slot) {
      throw ('Slot not found');
    }

    if (slot.status === 'confirmed') {
      throw ('Slot is already confirmed');
    }

    // Mark slot as confirmed
    slot.status = 'confirmed';
    await this.slotRepo.save(slot);

    return slot;
  }

  async updateSlotStatus(slotid: number, status: string): Promise<Slot> {
    const slot = await this.slotRepository.findOne({ where: { id:slotid } });

    if (!slot) {
      throw new Error(`Slot with ID ${slotid} not found.`);
    }

    slot.status = status;
    return this.slotRepository.save(slot);
  }

}