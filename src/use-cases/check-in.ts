import type { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { OnlyOneCheckInPerDayAllowed } from './errors/only-one-check-in-per-day-allowed-error'

interface ICheckInUseCase {
  userId: string
  gymId: string
}

interface ICheckInCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  private checkInsRepository: CheckInsRepository

  constructor(checkInsRepository: CheckInsRepository) {
    this.checkInsRepository = checkInsRepository
  }

  async execute({
    userId,
    gymId,
  }: ICheckInUseCase): Promise<ICheckInCaseResponse> {
    let checkIn = await this.checkInsRepository.findByUserIdToday(userId)

    if (checkIn) throw new OnlyOneCheckInPerDayAllowed()

    checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    return {
      checkIn,
    }
  }
}
