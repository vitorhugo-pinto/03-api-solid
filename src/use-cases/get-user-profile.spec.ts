import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { describe, it, expect, beforeEach } from 'vitest'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let getUserProfileUseCase: GetUserProfileUseCase

describe('Get user profile use case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    getUserProfileUseCase = new GetUserProfileUseCase(usersRepository)
  })

  it('should successfully retrieve a user profile given its ID', async () => {
    const { id } = await usersRepository.create({
      name: 'mock-name',
      email: 'mock@email.com',
      password: 'mock-password',
    })

    const { user } = await getUserProfileUseCase.execute({
      userId: id,
    })

    expect(user).toBeTruthy()
  })

  it('should throw Resource not found error', async () => {
    await expect(() =>
      getUserProfileUseCase.execute({
        userId: 'mock-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
