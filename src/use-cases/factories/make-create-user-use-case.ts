import { PrismaUsersRepository } from '@/repositories/prisma-repositories/prisma-users-repository'
import { CreateUserUseCase } from '../create-user'

export function makeCreateUserUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const createUserUseCase = new CreateUserUseCase(prismaUsersRepository)

  return createUserUseCase
}
