import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Query,
  Redirect,
} from '@nestjs/common';
import type { HttpRedirectResponse } from '@nestjs/common';

import { AppService } from './app.service';
import { ZodValidationPipe } from './pipes/zod';
import { redirectLinkSchema } from './schemas/zod';
import type { RedirectLinkDto } from './schemas/zod';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect()
  get(): HttpRedirectResponse {
    const defaultRedirectLink = this.appService.getDefaultRedirect();
    return { url: defaultRedirectLink, statusCode: HttpStatus.FOUND };
  }

  @Get('go')
  @Redirect()
  async getRedirectedLink(
    @Query(new ZodValidationPipe(redirectLinkSchema)) query: RedirectLinkDto,
  ): Promise<HttpRedirectResponse> {
    const destinationId = query.to;
    const redirectLink = await this.appService.getRedirectedLink(destinationId);

    return { url: redirectLink, statusCode: HttpStatus.FOUND };
  }

  @Get('status')
  getStatus(): string {
    return this.appService.getStatus();
  }
}
