import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

const bootstrap = async () => {
  const port = process.env.PORT ?? 3000;

  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());
  await app.listen(port);

  Logger.log(`App online on port [${port}]`);
};

bootstrap();
