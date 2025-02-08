import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './booking.entity';
import { Slot } from '../slots/slot.entity';
import { Carpenter } from '../carpenters/carpenter.entity';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    @InjectRepository(Slot) private slotRepo: Repository<Slot>,
    @InjectRepository(Carpenter) private carpenterRepo: Repository<Carpenter>,
  ) {}

  //  Get all bookings with related slot & carpenter info
  async getAllBookings(): Promise<Booking[]> {
    const bookings = await this.bookingRepo.find({
      relations: ['slot', 'slot.carpenter'], // Ensure slot and carpenter data are included
    });

    return bookings.map((booking) => ({
      ...booking,
      date: booking.slot?.dates ? new Date(booking.slot.dates).toLocaleDateString() : 'Date not available',
      carpenterName: booking.slot?.carpenter?.name || 'Carpenter not found',
    }));
  }

  //  Get bookings for a specific user
  async getBookingsByUser(userId: number): Promise<any[]> {
    const bookings = await this.bookingRepo.find({
      where: { user_id: userId },
      relations: ['slot', 'slot.carpenter'],
    });

    if (!bookings.length) {
      throw new NotFoundException('No bookings found for this user');
    }

    return bookings.map((booking) => ({
      booking_id: booking.id,
      status: booking.status,
      date: booking.slot?.dates,
      time: booking.slot?.start_time,
      carpenter_name: booking.slot?.carpenter?.name || 'Carpenter not found',
    }));
  }

  
  //  Book a slot
  async bookSlot(userId: number, slotId: number): Promise<Booking> {
    const slot = await this.slotRepo.findOne({ where: { id: slotId }, relations: ['carpenter'] });

    if (!slot) throw new NotFoundException('Slot not found');
    if (slot.status === 'booked') throw new BadRequestException('Slot is already booked');

    slot.status = 'booked';
    await this.slotRepo.save(slot);

    const newBooking = this.bookingRepo.create({
      user_id: userId,
      slot: slot, 
      status: 'booked',
    });

    return this.bookingRepo.save(newBooking);
  }

  //  Delete a booking
  async deleteBooking(bookingId: number): Promise<void> {
    const booking = await this.bookingRepo.findOne({ where: { id: bookingId }, relations: ['slot'] });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found.`);
    }

    // Make slot available again
    if (booking.slot) {
      booking.slot.status = 'available';
      await this.slotRepo.save(booking.slot);
    }

    await this.bookingRepo.delete(bookingId);
  }

  //  Cancel a booking
  async cancelBooking(bookingId: number): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({ where: { id: bookingId }, relations: ['slot'] });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status === 'canceled') throw new BadRequestException('Booking is already canceled');

    booking.status = 'canceled';
    await this.bookingRepo.save(booking);

    if (booking.slot) {
      booking.slot.status = 'available';
      await this.slotRepo.save(booking.slot);
    }

    return booking;
  }

  //  Confirm a booking
  async confirmBooking(bookingId: number): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({ where: { id: bookingId }, relations: ['slot'] });

    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.status === 'confirmed') throw new BadRequestException('Booking is already confirmed');

    booking.status = 'confirmed';
    await this.bookingRepo.save(booking);

    return booking;
  }
}
