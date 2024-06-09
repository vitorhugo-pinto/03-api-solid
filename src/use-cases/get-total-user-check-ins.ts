import { CheckInsRepository } from '@/repositories/check-ins-repository'

interface IGetTotalUserCheckInsUseCaseRequest {
  userId: string
}

interface IGetTotalUserCheckInsUseCaseResponse {
  userId: string
  totalCheckIns: number
}

export class GetTotalUserCheckInsUseCase {
  private checkInsRepository: CheckInsRepository

  constructor(checkInsRepository: CheckInsRepository) {
    this.checkInsRepository = checkInsRepository
  }

  async execute({
    userId,
  }: IGetTotalUserCheckInsUseCaseRequest): Promise<IGetTotalUserCheckInsUseCaseResponse> {
    const totalCheckIns =
      await this.checkInsRepository.getTotalCheckInsByUserId(userId)

    return {
      userId,
      totalCheckIns,
    }
  }
}
