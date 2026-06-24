import { Injectable, Logger, Inject } from '@nestjs/common';
import { PrismaService } from './services/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as cacheManager from 'cache-manager';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter } from 'prom-client';

@Injectable()
export class AppService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(CACHE_MANAGER) private readonly cache: cacheManager.Cache,
    @InjectMetric('url_redirects_total') private readonly counter: Counter<string>,
  ) {}

  getDefaultRedirect(): string {
    return 'https://projetohanna.com';
  }

  async getRedirectedLink(id: string): Promise<string> {
    const cacheKey = `link:${id}`;
    const cachedUrl = await this.cache.get<string>(cacheKey);

    if (cachedUrl) {
      this.counter.inc({ status: 'cache_hit' });
      return cachedUrl;
    }

    const link = await this.prisma.link.findUnique({
      where: { code: id },
    });

    if (!link) {
      Logger.warn(`Redirect link not found for [${id}]`);
      this.counter.inc({ status: 'not_found' });
      return this.getDefaultRedirect();
    }

    await this.cache.set(cacheKey, link.url);
    this.counter.inc({ status: 'db_lookup' });

    return link.url;
  }

  getStatus(): string {
    return 'App online';
  }
}
