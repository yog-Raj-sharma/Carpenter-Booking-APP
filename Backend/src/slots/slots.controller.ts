import { Controller, Get, Patch, Param, Query, Put, Body, BadRequestException } from '@nestjs/common';
import { SlotService } from './slots.service'; 

@Controller('slots')
export class SlotsController {
  constructor(private readonly slotService: SlotService) {} 

  @Get()
  async getAvailableSlots() {
    return this.slotService.getAvailableSlots();
  }

 

  @Patch(':id/confirm')
  async confirmSlot(@Param('id') id: number) {
    try {
      return await this.slotService.confirmSlot(id); 
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
