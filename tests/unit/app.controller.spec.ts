import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';

import { AppController } from '../../src/app.controller';
import { AppService } from '../../src/app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('get status tests', () => {
    it('should return app status', () => {
      const response = appController.getStatus();
      expect(response).toBe('App online');
    });
  });

  describe('get default redirect link', () => {
    it('should redirect to default link', () => {
      const response = appController.get();
      expect(response).toEqual({
        url: AppService.LINKS_MAPPING.default,
        statusCode: HttpStatus.FOUND,
      });
    });
  });

  describe('get default redirect link', () => {
    it('should map id to redirect link', async () => {
      const id = 'discord';
      const payload = {
        to: id,
      };

      const response = await appController.getRedirectedLink(payload);

      expect(response).toEqual({
        url: AppService.LINKS_MAPPING.discord,
        statusCode: HttpStatus.FOUND,
      });
    });

    it('should redirect to default link', async () => {
      const id = 'unknown-id';
      const payload = {
        to: id,
      };

      const response = await appController.getRedirectedLink(payload);

      expect(response).toEqual({
        url: AppService.LINKS_MAPPING.default,
        statusCode: HttpStatus.FOUND,
      });
    });
  });
});
