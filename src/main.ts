import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3001;

const defaultConfig = new DocumentBuilder()
  .setTitle('Home Library API')
  .setDescription('The home-library API')
  .setVersion('0.0.1')
  .addTag('home-library')
  .build();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const document = SwaggerModule.createDocument(app, defaultConfig);

  SwaggerModule.setup('doc', app, document);
  await app.listen(PORT);
}

bootstrap();
