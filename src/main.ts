import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const bootstrap = async () => {
  const port = process.env.PORT ?? 3000;

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  const config = new DocumentBuilder()
    .setTitle('Encurtador de Links')
    .setDescription('API interna de encurtador de links do Projeto Hanna')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen({ port: Number(port), host: '0.0.0.0' });

  Logger.log(`App online on port [${port}]`);
  Logger.log(`Swagger documentation available at http://localhost:${port}/docs`);
};

bootstrap();
