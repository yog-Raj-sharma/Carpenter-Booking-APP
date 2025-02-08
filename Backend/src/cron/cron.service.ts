import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Slot } from '../slots/slot.entity';
import { Booking } from '../bookings/booking.entity';
import * as cron from 'node-cron';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    @InjectRepository(Slot) private slotRepo: Repository<Slot>,
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
  ) {
    this.scheduleCleanup(); // Start the cron job when the service is initialized
   // this.deleteOldEntries();  // For testing clean up during dev 
  }

  //  Schedule Task to Run Every Night at 12:00 AM
  scheduleCleanup() {
    cron.schedule('0 0 * * *', async () => {
      await this.deleteOldEntries();
    });

    this.logger.log('Scheduled cleanup task initialized.');
  }

  //  Function to Delete Slots & Bookings of Past Days
  async deleteOldEntries() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ensure we compare only the date part

    try {
      // Delete bookings associated with past slots
      await this.bookingRepo
        .createQueryBuilder()
        .delete()
        .where('slotId IN (SELECT id FROM slots WHERE dates < :today)', { today })
        .execute();

      this.logger.log('Deleted past bookings successfully.');

      // Delete past slots
      await this.slotRepo
        .createQueryBuilder()
        .delete()
        .where('dates < :today', { today })
        .execute();

      this.logger.log('Deleted past slots successfully.');
    } catch (error) {
      this.logger.error('Error deleting past slots and bookings:', error);
    }
  }
}
