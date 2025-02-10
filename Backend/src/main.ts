import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const dataSource = app.get(DataSource);

  if (!dataSource.isInitialized) {  
    try {
      await dataSource.initialize();
      console.log(' Database connection is successful!');
    } catch (error) {
      console.error(' Database connection failed:', error);
    }
  } else {
    console.log(' Database is already connected!');
  }
  
  app.enableCors(); 

  await app.listen(3000);
}
bootstrap();