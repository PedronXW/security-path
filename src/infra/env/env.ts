import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string().default('secret'),
  DATABASE_URL: z.string().default('postgres://postgres:postgres@localhost:5432/postgres'),
  RESET_PASSWORD_SECRET: z.string().default('secret'),
  VERIFY_EMAIL_SECRET: z.string().default('secret'),
  DYNAMODB_CLIENT_TABLE: z.string().default('clients'),
  DYNAMODB_EQUIPMENT_TABLE: z.string().default('equipments'),
  DYNAMODB_OBSERVER_TABLE: z.string().default('observers'),
  DYNAMODB_INSTALLATION_TABLE: z.string().default('installations'),
  DYNAMODB_CALL_CENTER_TABLE: z.string().default('call-centers'),
  DYNAMODB_REGION: z.string().default('us-east-1'),
  DYNAMODB_ENDPOINT: z.string().default('http://localhost:8000'),
  DYNAMODB_ACCESS_KEY: z.string().default('fakeMyKeyId'),
  DYNAMODB_SECRET_KEY: z.string().default('fakeSecretAccessKey'),
})

export type Env = z.infer<typeof envSchema>
