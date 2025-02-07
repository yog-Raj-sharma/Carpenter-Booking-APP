import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carpenter } from './carpenter.entity';

@Injectable()
export class CarpentersService {
  constructor(
    @InjectRepository(Carpenter)
    private readonly carpenterRepository: Repository<Carpenter>,
  ) {}

  //  Fetch all carpenters with slots
  async getAllCarpenters(): Promise<Carpenter[]> {
  return this.carpenterRepository.find(); // Fetch only carpenters, no slots
}


  //  Fetch a single carpenter by ID
  async getCarpenterById(id: number): Promise<Carpenter> {
    const carpenter = await this.carpenterRepository.findOne({
      where: { id },
      relations: ['slots'], //  Include slots when fetching
    });

    if (!carpenter) throw new NotFoundException(`Carpenter with ID ${id} not found`);
    return carpenter;
  }

  //  Create a new carpenter
  async createCarpenter(name: string): Promise<Carpenter> {
    const existingCarpenter = await this.carpenterRepository.findOne({ where: { name } });
    if (existingCarpenter) throw new ConflictException('Carpenter with this name already exists'); 

    const newCarpenter = this.carpenterRepository.create({ name });
    return this.carpenterRepository.save(newCarpenter);
  }
}
