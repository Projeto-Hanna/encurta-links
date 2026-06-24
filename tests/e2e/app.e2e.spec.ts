import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/services/prisma.service';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { APP_GUARD } from '@nestjs/core';
import { register } from 'prom-client';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  const mockPrismaService = {
    link: {
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.code === 'discord') {
          return Promise.resolve({ url: 'https://google.com' });
        }
        return Promise.resolve(null);
      }),
    },
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideProvider(APP_GUARD)
      .useValue({ canActivate: () => true })
      .compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter()
    );
    await app.init();
    await app.listen(0);
  });

  afterAll(async () => {
    await app.close();
    register.clear();
  });

  it('should reach / (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(302)
      .expect('location', 'https://projetohanna.com');
  });

  it('should reach /status (GET)', () => {
    return request(app.getHttpServer())
      .get('/status')
      .expect(200)
      .expect('App online');
  });

  describe('/go (GET)', () => {
    it('should reach with unknown id', () => {
      return request(app.getHttpServer())
        .get('/go?to=unknown-id')
        .expect(302)
        .expect('location', 'https://projetohanna.com');
    });

    it('should reach with discord id', () => {
      return request(app.getHttpServer())
        .get('/go?to=discord')
        .expect(302)
        .expect('location', 'https://google.com');
    });

    it('should not reach by undefined query params', () => {
      return request(app.getHttpServer()).get('/go').expect(400).expect({
        message: 'Validation failed',
        error: 'Bad Request',
        statusCode: 400,
      });
    });
  });
});

