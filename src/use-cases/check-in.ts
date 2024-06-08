import type { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { OnlyOneCheckInPerDayAllowedError } from './errors/only-one-check-in-per-day-allowed-error'
import { GymsRepository } from '@/repositories/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { getDistanceBetweenCoordinates } from '@/utils/distance-between-coordinates'
import { OutOfRangeError } from './errors/out-of-range-error'

interface ICheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface ICheckInCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  private checkInsRepository: CheckInsRepository
  private gymsRepository: GymsRepository

  constructor(
    checkInsRepository: CheckInsRepository,
    gymsRepository: GymsRepository,
  ) {
    this.checkInsRepository = checkInsRepository
    this.gymsRepository = gymsRepository
  }

  async execute({
    userId,
    gymId,
    userLatitude,
    userLongitude,
  }: ICheckInUseCaseRequest): Promise<ICheckInCaseResponse> {
    const MAX_DISTANCE_IN_KILOMETERS = 0.1
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) throw new ResourceNotFoundError()

    const distanceDiff = getDistanceBetweenCoordinates({
      from: { latitude: userLatitude, longitude: userLongitude },
      to: {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    })

    if (distanceDiff > MAX_DISTANCE_IN_KILOMETERS) throw new OutOfRangeError()

    let checkIn = await this.checkInsRepository.findByUserIdToday(userId)

    if (checkIn) throw new OnlyOneCheckInPerDayAllowedError()

    checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    return {
      checkIn,
    }
  }
}
