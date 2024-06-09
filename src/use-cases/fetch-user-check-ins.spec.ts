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
    })

    expect(checkIns).toHaveLength(2)
    expect(userId).toEqual(expect.any(String))
  })
})
