import { PrismaGymsRepository } from '@/repositories/prisma-repositories/prisma-gyms-repository'
import { FetchNearbyGymsUseCase } from '../fetch-nearby-gyms'

export function makeFetchNearbyGymsUseCase() {
  const prismaGymsRepository = new PrismaGymsRepository()

  const checkInUseCase = new FetchNearbyGymsUseCase(prismaGymsRepository)

  return checkInUseCase
}
