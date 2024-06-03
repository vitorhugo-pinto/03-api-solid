import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { describe, it, expect, beforeEach } from 'vitest'
import { hash } from 'bcryptjs'
import { AuthenticateUseCase } from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let authenticateUseCase: AuthenticateUseCase

describe('Authenticate user use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    authenticateUseCase = new AuthenticateUseCase(usersRepository)
  })

  it('should successfully authenticate a user', async () => {
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
    expect(async () => {
      await authenticateUseCase.execute({
        email: 'mock-diff@email.com',
        password: 'mock-password',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should throw invalid credentials due to different password', async () => {
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
