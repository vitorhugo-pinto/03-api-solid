import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'

let checkInsRepository: InMemoryCheckInsRepository
let checkInUseCase: CheckInUseCase

describe('Create user use case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    checkInUseCase = new CheckInUseCase(checkInsRepository)
  })

  it('should successfully create a user', async () => {
    const { checkIn } = await checkInUseCase.execute({
      userId: 'mock-user-id',
      gymId: 'mock-gym-id',
    })

    expect(checkIn).toBeTruthy()
  })
})
