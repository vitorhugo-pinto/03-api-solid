import { CheckInUseCase } from '../check-in'
import { PrismaCheckInsRepository } from '@/repositories/prisma-repositories/prisma-check-ins-repository'
import { PrismaGymsRepository } from '@/repositories/prisma-repositories/prisma-gyms-repository'

export function makeCheckInUseCase() {
  const prismaCheckInRepository = new PrismaCheckInsRepository()
  const prismaGymsRepository = new PrismaGymsRepository()

  const checkInUseCase = new CheckInUseCase(
    prismaCheckInRepository,
    prismaGymsRepository,
  )

  return checkInUseCase
}
