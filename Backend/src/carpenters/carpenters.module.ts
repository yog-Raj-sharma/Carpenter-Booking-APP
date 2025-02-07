import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Carpenter } from './carpenter.entity';
import { CarpentersService } from './carpenters.service';
import { CarpentersController } from './carpenters.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Carpenter])], // Registers Carpenter entity
  controllers: [CarpentersController], // Registers Controller
  providers: [CarpentersService], // Registers Service
  exports: [TypeOrmModule.forFeature([Carpenter])], // Ensure that the Carpenter repository is exported
})
export class CarpentersModule {}
