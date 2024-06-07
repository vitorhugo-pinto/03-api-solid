import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { OnlyOneCheckInPerDayAllowed } from './errors/only-one-check-in-per-day-allowed-error'

let checkInsRepository: InMemoryCheckInsRepository
let checkInUseCase: CheckInUseCase

describe('Create user use case', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    checkInUseCase = new CheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should successfully create a user', async () => {
    const { checkIn } = await checkInUseCase.execute({
      userId: 'mock-user-id',
      gymId: 'mock-gym-id',
    })

    expect(checkIn).toBeTruthy()
  })

  it('should throw cannot have two check ins in the same day', async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 12, 0, 0))

    await checkInUseCase.execute({
      userId: 'mock-user-id',
      gymId: 'mock-gym-id',
    })

    await expect(() =>
      checkInUseCase.execute({
        userId: 'mock-user-id',
        gymId: 'mock-gym-id',
      }),
    ).rejects.toBeInstanceOf(OnlyOneCheckInPerDayAllowed)
  })

  it('should create two check-ins due to different dates', async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 12, 0, 0))

    await checkInUseCase.execute({
      userId: 'mock-user-id',
      gymId: 'mock-gym-id',
    })

    vi.setSystemTime(new Date(2024, 0, 2, 12, 0, 0))

    const { checkIn } = await checkInUseCase.execute({
      userId: 'mock-user-id',
      gymId: 'mock-gym-id',
    })

    expect(checkIn).toBeTruthy()
  })
})
