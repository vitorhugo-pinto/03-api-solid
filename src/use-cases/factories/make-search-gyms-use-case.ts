import { SearchGymsUseCase } from '../search-gyms'
import { PrismaGymsRepository } from '@/repositories/prisma-repositories/prisma-gyms-repository'

export function makeSearchGymsUseCase() {
  const prismaGymsRepository = new PrismaGymsRepository()

  const checkInUseCase = new SearchGymsUseCase(prismaGymsRepository)

  return checkInUseCase
}
