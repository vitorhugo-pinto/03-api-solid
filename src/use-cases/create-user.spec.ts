import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { describe, it, expect } from 'vitest'
import { CreateUserUseCase } from './create-user'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { compare } from 'bcryptjs'

describe('Create user use case', () => {
  it('should successfully create a user', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const createUserUseCase = new CreateUserUseCase(usersRepository)

    const { user } = await createUserUseCase.execute({
      name: 'mock-name',
      email: 'mock@email.com',
      password: 'mock-password',
    })

    expect(user).toBeTruthy()
  })

  it('should save hashed password', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const createUserUseCase = new CreateUserUseCase(usersRepository)

    const password = 'mock-password'

    const { user } = await createUserUseCase.execute({
      name: 'mock-name',
      email: 'mock@email.com',
      password,
    })

    const equalHash = await compare(password, user.password)

    expect(equalHash).toBe(true)
  })

  it('should throw User already exists error', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const createUserUseCase = new CreateUserUseCase(usersRepository)

    const sameEmail = 'mock@email.com'

    await createUserUseCase.execute({
      name: 'mock-name',
      email: sameEmail,
      password: 'mock-password',
    })

    await expect(() =>
      createUserUseCase.execute({
        name: 'mock-name',
        email: sameEmail,
        password: 'mock-password',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
