import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetTotalUserCheckInsUseCase } from './get-total-user-check-ins'

let checkInsRepository: InMemoryCheckInsRepository
let getTotalUserCheckInsUseCase: GetTotalUserCheckInsUseCase

describe('Get total user check-ins ', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    getTotalUserCheckInsUseCase = new GetTotalUserCheckInsUseCase(
      checkInsRepository,
    )
  })

  it('should successfully get total user check-ins', async () => {
    await checkInsRepository.create({
      user_id: 'mock-user-id',
      gym_id: 'mock-gym-id-01',
    })

    await checkInsRepository.create({
      user_id: 'mock-user-id',
      gym_id: 'mock-gym-id-02',
    })

    const { userId, totalCheckIns } = await getTotalUserCheckInsUseCase.execute(
      {
        userId: 'mock-user-id',
      },
    )

    expect(totalCheckIns).toEqual(2)
    expect(userId).toEqual(expect.any(String))
  })
})
