import { PrismaGymsRepository } from '@/repositories/prisma-repositories/prisma-gyms-repository'
import { CreateGymUseCase } from '../create-gym'

export function makeCreateGymUseCase() {
  const prismaGymsRepository = new PrismaGymsRepository()

  const checkInUseCase = new CreateGymUseCase(prismaGymsRepository)

  return checkInUseCase
}
