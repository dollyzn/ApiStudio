import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    N8N_WEBHOOK_URL: z.url("N8N_WEBHOOK_URL deve ser uma URL válida"),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    QZ_PRIVATE_KEY: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_NAME: z.string().default("API Studio"),
    NEXT_PUBLIC_AUTH_TOKEN_KEY: z.string().default("api_studio_token"),
    NEXT_PUBLIC_QZ_CERTIFICATE_URL: z.string().default("/qz-cert.crt"),
    NEXT_PUBLIC_QZ_SIGNATURE_ENDPOINT: z.string().default("/api/print/sign"),
  },
  runtimeEnv: {
    N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_AUTH_TOKEN_KEY: process.env.NEXT_PUBLIC_AUTH_TOKEN_KEY,
    QZ_PRIVATE_KEY: process.env.QZ_PRIVATE_KEY,
    NEXT_PUBLIC_QZ_CERTIFICATE_URL: process.env.NEXT_PUBLIC_QZ_CERTIFICATE_URL,
    NEXT_PUBLIC_QZ_SIGNATURE_ENDPOINT:
      process.env.NEXT_PUBLIC_QZ_SIGNATURE_ENDPOINT,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
