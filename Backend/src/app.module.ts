{/* 
  import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlotsModule } from './slots/slots.module';
import { CarpentersModule } from './carpenters/carpenters.module';
import { BookingsModule } from './bookings/bookings.module';
import { CronModule } from './cron/cron.module'; 

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
   CronModule,
  ],
})
export class AppModule {} */}
 
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SlotsModule } from './slots/slots.module';
import { CarpentersModule } from './carpenters/carpenters.module';
import { BookingsModule } from './bookings/bookings.module';
import { CronModule } from './cron/cron.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load environment variables
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false, // Handle SSL
    }),
    SlotsModule,
    BookingsModule,
    CarpentersModule,
    CronModule,
  ],
})
export class AppModule {} 


