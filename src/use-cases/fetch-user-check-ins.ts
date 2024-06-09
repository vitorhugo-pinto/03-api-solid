import type { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface IFetchUserCheckInsUseCaseRequest {
  userId: string
  page: number
  size: number
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
    page,
    size,
  }: IFetchUserCheckInsUseCaseRequest): Promise<IFetchUserCheckInsUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
      size,
    )

    if (!checkIns) throw new ResourceNotFoundError()

    return {
      userId,
      checkIns,
    }
  }
}
