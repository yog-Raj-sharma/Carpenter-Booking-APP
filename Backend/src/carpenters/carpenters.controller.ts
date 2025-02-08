import { Controller, Get, Post, Param, Body, NotFoundException, ConflictException, ParseIntPipe } from '@nestjs/common';
import { CarpentersService } from './carpenters.service';

@Controller('carpenters')
export class CarpentersController {
  constructor(private readonly carpentersService: CarpentersService) {}

  //  Fetch all carpenters
  @Get()
  async getAllCarpenters() {
    return this.carpentersService.getAllCarpenters();
  }

  //  Fetch a single carpenter by ID
  @Get(':id')
  async getCarpenterById(@Param('id', ParseIntPipe) id: number) {
    return this.carpentersService.getCarpenterById(id); 
  }

  //  Create a new carpenter
  @Post()
  async createCarpenter(@Body('name') name: string) {
    try {
      return await this.carpentersService.createCarpenter(name);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error; 
      }
      throw new NotFoundException('Could not create carpenter');
    }
  }
}
