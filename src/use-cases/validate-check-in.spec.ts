import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { CheckInValidationExpiredError } from './errors/check-in-validation-expired-error'

let checkInsRepository: InMemoryCheckInsRepository
let validateCheckInUseCase: ValidateCheckInUseCase

describe('Validate check-in use case', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    validateCheckInUseCase = new ValidateCheckInUseCase(checkInsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should successfully validate a check-in', async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 12, 0, 0))

    const { id } = await checkInsRepository.create({
      gym_id: 'mock-gym-id',
      user_id: 'mock-user-id',
    })
    const { validatedCheckIn } = await validateCheckInUseCase.execute({
      checkInId: id,
    })

    expect(validatedCheckIn.validated_at).toBeTruthy()
    expect(validatedCheckIn.validated_at).toEqual(new Date())
  })

  it('should throw check in not found', async () => {
    await expect(() =>
      validateCheckInUseCase.execute({
        checkInId: 'check-in-mock-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should throw check in is expired', async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 12, 0, 0))

    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    // mili * secs * minutes
    const expirationTime = 1000 * 60 * 21

    vi.advanceTimersByTime(expirationTime)

    await expect(() =>
      validateCheckInUseCase.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(CheckInValidationExpiredError)
  })
})
