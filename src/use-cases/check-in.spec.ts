import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { OnlyOneCheckInPerDayAllowedError } from './errors/only-one-check-in-per-day-allowed-error'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { OutOfRangeError } from './errors/out-of-range-error'

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
      latitude: new Decimal(-5.8211034),
      longitude: new Decimal(-35.2228748),
    })

    // in range
    // -5.8212464 - -35.2225783

    // out of range
    // -5.8228616 - -35.2087766

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should successfully create a check-in', async () => {
    const { checkIn } = await checkInUseCase.execute({
      userId: 'mock-user-id',
      gymId: 'mock-gym-id',
      userLatitude: -5.8212464,
      userLongitude: -35.2225783,
    })

    expect(checkIn).toBeTruthy()
  })

  it('should throw cannot have two check ins in the same day', async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 12, 0, 0))

    await checkInUseCase.execute({
      userId: 'mock-user-id',
      gymId: 'mock-gym-id',
      userLatitude: -5.8212464,
      userLongitude: -35.2225783,
    })

    await expect(() =>
      checkInUseCase.execute({
        userId: 'mock-user-id',
        gymId: 'mock-gym-id',
        userLatitude: -5.8212464,
        userLongitude: -35.2225783,
      }),
    ).rejects.toBeInstanceOf(OnlyOneCheckInPerDayAllowedError)
  })

  it('should create two check-ins due to different dates', async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 12, 0, 0))

    await checkInUseCase.execute({
      userId: 'mock-user-id',
      gymId: 'mock-gym-id',
      userLatitude: -5.8212464,
      userLongitude: -35.2225783,
    })

    vi.setSystemTime(new Date(2024, 0, 2, 12, 0, 0))

    const { checkIn } = await checkInUseCase.execute({
      userId: 'mock-user-id',
      gymId: 'mock-gym-id',
      userLatitude: -5.8212464,
      userLongitude: -35.2225783,
    })

    expect(checkIn).toBeTruthy()
  })

  it('should throw out of gym range', async () => {
    await expect(() =>
      checkInUseCase.execute({
        userId: 'mock-user-id',
        gymId: 'mock-gym-id',
        userLatitude: -5.8228616,
        userLongitude: -35.2087766,
      }),
    ).rejects.toBeInstanceOf(OutOfRangeError)
  })
})
