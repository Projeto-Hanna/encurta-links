import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  // TODO: to change with provider calls
  public static LINKS_MAPPING = {
    default: 'https://projetohanna.com',
    discord: 'https://google.com',
  } as const;

  getDefaultRedirect(): string {
    return AppService.LINKS_MAPPING.default;
  }

  async getRedirectedLink(id: string): Promise<string> {
    const idAsKey = id as keyof typeof AppService.LINKS_MAPPING;
    const linkToRedirect = AppService.LINKS_MAPPING[idAsKey];

    if (!linkToRedirect) {
      Logger.warn(`Redirect link not found for [${id}]`);
      const defaultRedirectLink = this.getDefaultRedirect();
      return defaultRedirectLink;
    }

    return linkToRedirect;
  }

  getStatus(): string {
    return 'App online';
  }
}
