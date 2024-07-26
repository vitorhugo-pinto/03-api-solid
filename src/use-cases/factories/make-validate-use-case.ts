import { ValidateCheckInUseCase } from '../validate-check-in'
import { PrismaCheckInsRepository } from '@/repositories/prisma-repositories/prisma-check-ins-repository'

export function makeValidateCheckInUseCase() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository()

  const checkInUseCase = new ValidateCheckInUseCase(prismaCheckInsRepository)

  return checkInUseCase
}
