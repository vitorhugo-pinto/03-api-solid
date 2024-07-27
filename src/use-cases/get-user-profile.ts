import { UsersRepository } from '@/repositories/users-repository'
import type { User } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface IGetUserProfileRequest {
  userId: string
}

interface IGetUserProfileResponse {
  user: Omit<User, 'password' | 'created_at'>
}

export class GetUserProfileUseCase {
  private usersRepository: UsersRepository

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository
  }

  async execute({
    userId,
  }: IGetUserProfileRequest): Promise<IGetUserProfileResponse> {
    const userFound = await this.usersRepository.findById(userId)

    if (!userFound) throw new ResourceNotFoundError()

    return {
      user: {
        id: userFound.id,
        name: userFound.name,
        email: userFound.email,
      },
    }
  }
}
