import { FetchUserCheckInsUseCase } from '../fetch-user-check-ins'
import { PrismaCheckInsRepository } from '@/repositories/prisma-repositories/prisma-check-ins-repository'

export function makeFetchUserCheckInsUseCase() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository()

  const checkInUseCase = new FetchUserCheckInsUseCase(prismaCheckInsRepository)

  return checkInUseCase
}
