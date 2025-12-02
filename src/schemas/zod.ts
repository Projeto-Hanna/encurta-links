import { z } from 'zod';

export const redirectLinkSchema = z
  .object({
    to: z.string().min(1).max(15).trim().normalize().toLowerCase(),
  })
  .required();

export type RedirectLinkDto = z.infer<typeof redirectLinkSchema>;
