import { Controller, Get, Post, Patch, Param, Delete, Body, NotFoundException, BadRequestException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from '../common/dto/create-booking.dto';
import { UpdateBookingDto } from '../common/dto/update-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  //  Get all bookings (Optional, can be used for admin panel)
  @Get()
  async getAllBookings() {
    return this.bookingsService.getAllBookings();
  }

  @Get('user/:userId')
  async getBookingsByUser(@Param('userId') userId: number) {
    const bookings = await this.bookingsService.getBookingsByUser(userId);
    if (!bookings || bookings.length === 0) {
      throw new NotFoundException('No bookings found for this user');
    }
    return bookings;
  }

  //  Book a slot
  @Post()
  async bookSlot(@Body() createBookingDto: CreateBookingDto) {
    try {
      return await this.bookingsService.bookSlot(createBookingDto.user_id, createBookingDto.slot_id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

@Delete(':id')
  async deleteBooking(@Param('id') id: number) {
    try {
      await this.bookingsService.deleteBooking(id);
      return { message: `Booking with ID ${id} deleted successfully` };
    } catch (error) {
      throw (error);
    }
  }  

  //  Cancel a booking
  @Patch(':id/cancel')
  async cancelBooking(@Param('id') id: number) {
    try {
      return await this.bookingsService.cancelBooking(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //  Confirm a booking
  @Patch(':id/confirm')
  async confirmBooking(@Param('id') id: number) {
    try {
      return await this.bookingsService.confirmBooking(id);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
