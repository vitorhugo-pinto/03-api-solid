import { PrismaCheckInsRepository } from '@/repositories/prisma-repositories/prisma-check-ins-repository'
import { GetTotalUserCheckInsUseCase } from '../get-total-user-check-ins'

export function makeGetTotalUserCheckInsUseCase() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository()

  const checkInUseCase = new GetTotalUserCheckInsUseCase(
    prismaCheckInsRepository,
  )

  return checkInUseCase
}
