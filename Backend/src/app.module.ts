import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlotsModule } from './slots/slots.module';
import { CarpentersModule } from './carpenters/carpenters.module';
 import { BookingsModule } from './bookings/bookings.module';
 

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: process.env.password,
      database: 'Carpenters',
      autoLoadEntities: true,
      synchronize: true,
    }),
    SlotsModule,
   BookingsModule,
   CarpentersModule,
  ],
})
export class AppModule {}
