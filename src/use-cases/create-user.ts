import { UsersRepository } from '@/repositories/users-repository'
import bcryptjs from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import type { User } from '@prisma/client'

interface ICreateUserUseCaseRequest {
  name: string
  email: string
  password: string
}

interface ICreateUserCaseResponse {
  user: User
}

export class CreateUserUseCase {
  private usersRepository: UsersRepository

  constructor(usersRepository: UsersRepository) {
    this.usersRepository = usersRepository
  }

  async execute({
    name,
    email,
    password,
  }: ICreateUserUseCaseRequest): Promise<ICreateUserCaseResponse> {
    const userFound = await this.usersRepository.findByEmail(email)

    if (userFound) throw new UserAlreadyExistsError()

    const hashedPassword = await bcryptjs.hash(password, 6)

    const userCreated = await this.usersRepository.create({
      name,
      email,
      password: hashedPassword,
    })

    return {
      user: userCreated,
    }
  }
}
