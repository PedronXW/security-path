import { z } from 'zod'

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string().default('secret'),
  DATABASE_URL: z.string().default('postgres://postgres:postgres@localhost:5432/postgres'),
})

export type Env = z.infer<typeof envSchema>
