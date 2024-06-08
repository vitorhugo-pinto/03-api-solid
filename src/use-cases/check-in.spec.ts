import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { OnlyOneCheckInPerDayAllowed } from './errors/only-one-check-in-per-day-allowed-error'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let checkInUseCase: CheckInUseCase

describe('Create check-in use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: 'mock-gym-id',
      name: 'mock-gym-name',
      description: 'mock-gym-description',
      phone: 'mock-gym-phone',
      latitude: 0,
      longitude: 0,
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should successfully create a check-in', async () => {
    const { checkIn } = await checkInUseCase.execute({
      userId: 'mock-user-id',
      gymId: 'mock-gym-id',
      userLatitude: 1,
      userLongitude: 2,
    })

    expect(checkIn).toBeTruthy()
  })

  it('should throw cannot have two check ins in the same day', async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 12, 0, 0))

    await checkInUseCase.execute({
      userId: 'mock-user-id',
      gymId: 'mock-gym-id',
      userLatitude: 1,
      userLongitude: 2,
    })

    await expect(() =>
      checkInUseCase.execute({
        userId: 'mock-user-id',
        gymId: 'mock-gym-id',
        userLatitude: 1,
        userLongitude: 2,
      }),
    ).rejects.toBeInstanceOf(OnlyOneCheckInPerDayAllowed)
  })

  it('should create two check-ins due to different dates', async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 12, 0, 0))

    await checkInUseCase.execute({
      userId: 'mock-user-id',
      gymId: 'mock-gym-id',
      userLatitude: 1,
      userLongitude: 2,
    })

    vi.setSystemTime(new Date(2024, 0, 2, 12, 0, 0))

    const { checkIn } = await checkInUseCase.execute({
      userId: 'mock-user-id',
      gymId: 'mock-gym-id',
      userLatitude: 1,
      userLongitude: 2,
    })

    expect(checkIn).toBeTruthy()
  })
})
