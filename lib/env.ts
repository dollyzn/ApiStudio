import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    N8N_WEBHOOK_URL: z.url("N8N_WEBHOOK_URL deve ser uma URL válida"),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
  },
  client: {
    NEXT_PUBLIC_APP_NAME: z.string().default("API Studio"),
  },
  runtimeEnv: {
    N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
