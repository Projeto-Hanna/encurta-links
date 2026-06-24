import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './services/prisma.service';
import { CacheModule } from '@nestjs/cache-manager';
import { makeCounterProvider, PrometheusModule } from '@willsoto/nestjs-prometheus';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register({
      isGlobal: true,
      ttl: 600000, // Default TTL of 10 minutes (in milliseconds)
    }),
    PrometheusModule.register({
      path: '/metrics',
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000, // 1 minute
      limit: 60,   // Limit each IP to 60 requests per minute
    }]),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    makeCounterProvider({
      name: 'url_redirects_total',
      help: 'Total number of url redirects processed',
      labelNames: ['status'],
    }),
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
