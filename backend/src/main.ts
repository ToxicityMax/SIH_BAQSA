import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as express from 'express';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Swagger Setup
  const config = new DocumentBuilder()
    .setTitle('SIH')
    .setDescription('SIH B.A.Q.S.A Apis')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-access-token',
        in: 'header',
      },
      'x-access-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  app.use('/uploads', express.static(join(__dirname, '../media/uploads')));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(8000, '0.0.0.0');
}
bootstrap();
