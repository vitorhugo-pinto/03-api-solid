import type { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface IFetchUserCheckInsUseCaseRequest {
  userId: string
}

interface IFetchUserCheckInsUseCaseResponse {
  userId: string
  checkIns: CheckIn[]
}

export class FetchUserCheckInsUseCase {
  private checkInsRepository: CheckInsRepository

  constructor(checkInsRepository: CheckInsRepository) {
    this.checkInsRepository = checkInsRepository
  }

  async execute({
    userId,
  }: IFetchUserCheckInsUseCaseRequest): Promise<IFetchUserCheckInsUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(userId)

    if (!checkIns) throw new ResourceNotFoundError()

    return {
      userId,
      checkIns,
    }
  }
}
