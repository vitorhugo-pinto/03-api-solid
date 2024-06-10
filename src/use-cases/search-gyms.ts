import type { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface ISearchGymsUseCase {
  searchFor: string
  page: number
  size: number
}

interface ISearchGymsCaseResponse {
  gyms: Gym[]
}

export class SearchGymsUseCase {
  private gymsRepository: GymsRepository

  constructor(gymsRepository: GymsRepository) {
    this.gymsRepository = gymsRepository
  }

  async execute({
    searchFor,
    page,
    size,
  }: ISearchGymsUseCase): Promise<ISearchGymsCaseResponse> {
    const gyms = await this.gymsRepository.search(searchFor, page, size)

    return {
      gyms,
    }
  }
}
