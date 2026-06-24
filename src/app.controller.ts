import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Redirect,
} from '@nestjs/common';
import type { HttpRedirectResponse } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

import { AppService } from './app.service';
import { ZodValidationPipe } from './pipes/zod';
import { redirectLinkSchema } from './schemas/zod';
import type { RedirectLinkDto } from './schemas/zod';

@ApiTags('Redirecionamentos')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Redirect()
  @ApiOperation({ summary: 'Redirecionamento padrão da página inicial' })
  @ApiResponse({ status: 302, description: 'Redireciona para a página inicial padrão' })
  get(): HttpRedirectResponse {
    const defaultRedirectLink = this.appService.getDefaultRedirect();
    return { url: defaultRedirectLink, statusCode: HttpStatus.FOUND };
  }

  @Get('go')
  @Redirect()
  @ApiOperation({ summary: 'Redireciona o código encurtado para a URL de destino' })
  @ApiQuery({ name: 'to', description: 'O código único do link encurtado', required: true, type: String })
  @ApiResponse({ status: 302, description: 'Redireciona para a URL de destino mapeada' })
  @ApiResponse({ status: 400, description: 'A validação dos parâmetros falhou' })
  async getRedirectedLink(
    @Query(new ZodValidationPipe(redirectLinkSchema)) query: RedirectLinkDto,
  ): Promise<HttpRedirectResponse> {
    const destinationId = query.to;
    const redirectLink = await this.appService.getRedirectedLink(destinationId);

    return { url: redirectLink, statusCode: HttpStatus.FOUND };
  }

  @Get('status')
  @ApiOperation({ summary: 'Retorna o status online da aplicação' })
  @ApiResponse({ status: 200, description: 'Retorna a string de status ativo da aplicação' })
  getStatus(): string {
    return this.appService.getStatus();
  }
}
