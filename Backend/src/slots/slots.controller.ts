import { Controller, Get, Patch, Param, Query, Put, Body, BadRequestException } from '@nestjs/common';
import { SlotService } from './slots.service'; //  Ensure correct import

@Controller('slots')
export class SlotsController {
  constructor(private readonly slotService: SlotService) {} //  Match service name

  @Get()
  async getAvailableSlots() {
    return this.slotService.getAvailableSlots(); //  Calls service method
  }

  @Get('/by-date') //  Changed from '/slots' to '/by-date'
  async getSlotsByDate(@Query('dates') date: string) {
    console.log("Received date in controller:", date); //  Check if it's correct
    return this.slotService.getSlotsByDate(date);
  }

  @Patch(':id/confirm')
  async confirmSlot(@Param('id') id: number) {
    try {
      return await this.slotService.confirmSlot(id); //  Fixed service name
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Put(':id')
  async updateSlotStatus(
    @Param('id') id: number,
    @Body() updateSlotDto: { status: string }
  ) {
    return this.slotService.updateSlotStatus(id, updateSlotDto.status);
  }
}
