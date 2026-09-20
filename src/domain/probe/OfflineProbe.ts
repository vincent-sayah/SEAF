import { z } from 'zod';

export const offlineProbeSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  label: z.string().min(1).max(200),
  xapiStatement: z.string().min(2)
});

export type OfflineProbe = z.infer<typeof offlineProbeSchema>;
