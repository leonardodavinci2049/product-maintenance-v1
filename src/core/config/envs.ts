import { z } from "zod";

const serverEnvsSchema = z.object({
  PORT: z.coerce.number().positive(),
  CLIENT_ID: z.coerce.number().positive(),
  DATABASE_HOST: z.string().min(1),
  DATABASE_PORT: z.coerce.number().positive(),
  DATABASE_USER: z.string().min(1),
  DATABASE_PASSWORD: z.string().min(1),
  DATABASE_NAME: z.string().min(1),
});

const serverValidation = serverEnvsSchema.safeParse({
  PORT: process.env.PORT,
  CLIENT_ID: process.env.CLIENT_ID,
  DATABASE_HOST: process.env.DATABASE_HOST,
  DATABASE_PORT: process.env.DATABASE_PORT,
  DATABASE_USER: process.env.DATABASE_USER,
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
  DATABASE_NAME: process.env.DATABASE_NAME,
});

if (!serverValidation.success) {
  const errorMessages = serverValidation.error.issues
    .map((err) => `${err.path.join(".")}: ${err.message}`)
    .join("\n");
  throw new Error(`❌ Invalid server environment variables:\n${errorMessages}`);
}

const compatibilityEnvs = {
  APP_ID: process.env.APP_ID ? Number(process.env.APP_ID) : 0,
  EXTERNAL_API_MAIN_URL: process.env.EXTERNAL_API_MAIN_URL ?? "",
  API_KEY: process.env.API_KEY ?? "",
};

export const serverEnvs = {
  ...compatibilityEnvs,
  ...serverValidation.data,
};

export const envs = serverEnvs;
