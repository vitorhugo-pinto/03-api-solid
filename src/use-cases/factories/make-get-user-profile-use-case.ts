import { GetUserProfileUseCase } from '../get-user-profile'
import { PrismaUsersRepository } from '@/repositories/prisma-repositories/prisma-users-repository'

export function makeGetUserProfileUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()

  const checkInUseCase = new GetUserProfileUseCase(prismaUsersRepository)

  return checkInUseCase
}
