import { UsersRepository } from '@/repositories/users-repository'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'
import bcryptjs from 'bcryptjs'
import { User } from '@prisma/client'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

interface AuthenticateUseCaseResponse {
  user: User
}

export class AuthenticateUseCase {
  private usersRepository: UsersRepository

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository
  }

  async execute({
    email,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const user = await this.usersRepository.findByEmail(email)

    if (!user) throw new InvalidCredentialsError()

    const isPasswordCorrect = await bcryptjs.compare(password, user.password)

    if (!isPasswordCorrect) throw new InvalidCredentialsError()

    return {
      user,
    }
  }
}
