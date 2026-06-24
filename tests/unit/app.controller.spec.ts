import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { getToken } from '@willsoto/nestjs-prometheus';

import { AppController } from '../../src/app.controller';
import { AppService } from '../../src/app.service';
import { PrismaService } from '../../src/services/prisma.service';

describe('AppController', () => {
  let appController: AppController;

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

  const mockCacheManager = {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue(undefined),
  };

  const mockCounter = {
    inc: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: CACHE_MANAGER,
          useValue: mockCacheManager,
        },
        {
          provide: getToken('url_redirects_total'),
          useValue: mockCounter,
        },
      ],
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
        url: 'https://projetohanna.com',
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
        url: 'https://google.com',
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
        url: 'https://projetohanna.com',
        statusCode: HttpStatus.FOUND,
      });
    });
  });
});

