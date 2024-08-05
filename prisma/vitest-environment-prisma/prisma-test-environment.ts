import 'dotenv/config'

import { Environment } from 'vitest'
import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateDBUrl(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('No database url was provided.')
  }

  const dbUrl = new URL(process.env.DATABASE_URL)

  dbUrl.searchParams.set('schema', schema)

  return dbUrl.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    const randomSchema = randomUUID()
    const databaseURL = generateDBUrl(randomSchema)

    process.env.DATABASE_URL = databaseURL

    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${randomSchema}" CASCADE`,
        )

        await prisma.$disconnect()
      },
    }
  },
}
