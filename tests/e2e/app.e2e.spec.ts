import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { AppService } from '../../src/app.service';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should reach / (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(302)
      .expect(`Found. Redirecting to ${AppService.LINKS_MAPPING.default}`);
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
        .expect(`Found. Redirecting to ${AppService.LINKS_MAPPING.default}`);
    });

    it('should reach with discord id', () => {
      return request(app.getHttpServer())
        .get('/go?to=discord')
        .expect(302)
        .expect(`Found. Redirecting to ${AppService.LINKS_MAPPING.discord}`);
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
