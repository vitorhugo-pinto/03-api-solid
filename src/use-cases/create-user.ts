import { UserRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface ICreateUserUseCase {
  name: string
  email: string
  password: string
}

export class CreateUserUseCase {
  private userRepository: UserRepository

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository
  }

  async execute({ name, email, password }: ICreateUserUseCase) {
    const user = await this.userRepository.findByEmail(email)

    if (user) throw new UserAlreadyExistsError()

    const hashedPassword = await hash(password, 6)

    await this.userRepository.create({
      name,
      email,
      password: hashedPassword,
    })
  }
}
