import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Slot } from './slot.entity';
import { Carpenter } from '../carpenters/carpenter.entity';
import { SlotService } from './slots.service';
import { SlotsController } from './slots.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Slot, Carpenter])],
  providers: [SlotService],
  controllers: [SlotsController],
  exports: [SlotService],
})
export class SlotsModule {}


