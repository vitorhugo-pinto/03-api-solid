import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { describe, it, expect } from 'vitest'
import { hash } from 'bcryptjs'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate user use case', () => {
  it('should successfully authenticate a user', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(usersRepository)

    const userCreated = await usersRepository.create({
      name: 'mock-name',
      email: 'mock@email.com',
      password: await hash('mock-password', 6),
    })

    const { user } = await authenticateUseCase.execute({
      email: 'mock@email.com',
      password: 'mock-password',
    })

    expect(userCreated).toEqual(user)
  })

  it('should throw invalid credentials due to users not created yet - email', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(usersRepository)

    expect(async () => {
      await authenticateUseCase.execute({
        email: 'mock-diff@email.com',
        password: 'mock-password',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should throw invalid credentials due to different password', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      name: 'mock-name',
      email: 'mock@email.com',
      password: await hash('mock-password', 6),
    })

    expect(async () => {
      await authenticateUseCase.execute({
        email: 'mock@email.com',
        password: 'mock-password-diff',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
