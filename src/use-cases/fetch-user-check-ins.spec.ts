import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInsUseCase } from './fetch-user-check-ins'

let checkInsRepository: InMemoryCheckInsRepository
let fetchUserCheckInsUseCase: FetchUserCheckInsUseCase

describe('Fetch user check-ins ', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    fetchUserCheckInsUseCase = new FetchUserCheckInsUseCase(checkInsRepository)
  })

  it('should successfully fetch a user check-ins', async () => {
    await checkInsRepository.create({
      user_id: 'mock-user-id',
      gym_id: 'mock-gym-id-01',
    })

    await checkInsRepository.create({
      user_id: 'mock-user-id',
      gym_id: 'mock-gym-id-02',
    })

    const { userId, checkIns } = await fetchUserCheckInsUseCase.execute({
      userId: 'mock-user-id',
      page: 1,
      size: 10,
    })

    expect(checkIns).toHaveLength(2)
    expect(userId).toEqual(expect.any(String))
  })

  it('should fetch user check-ins of a certain page', async () => {
    for (let i = 1; i <= 13; i++) {
      await checkInsRepository.create({
        user_id: 'mock-user-id',
        gym_id: `mock-gym-id-${i}`,
      })
    }

    const { userId, checkIns } = await fetchUserCheckInsUseCase.execute({
      userId: 'mock-user-id',
      page: 2,
      size: 10,
    })

    expect(checkIns).toHaveLength(3)
    expect(userId).toEqual(expect.any(String))
  })
})
