import type { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'

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
    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    return {
      checkIn,
    }
  }
}
