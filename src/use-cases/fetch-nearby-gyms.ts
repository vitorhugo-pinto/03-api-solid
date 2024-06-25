import { GymsRepository } from '@/repositories/gyms-repository'
import { Gym } from '@prisma/client'

interface IFetchNearbyGymsUseCaseRequest {
  userLatitude: number
  userLongitude: number
}

interface IFetchNearbyGymsUseCaseResponse {
  gyms: Gym[]
}

export class FetchNearbyGymsUseCase {
  private gymsRepository: GymsRepository

  constructor(gymsRepository: GymsRepository) {
    this.gymsRepository = gymsRepository
  }

  async execute({
    userLatitude,
    userLongitude,
  }: IFetchNearbyGymsUseCaseRequest): Promise<IFetchNearbyGymsUseCaseResponse> {
    const MAX_RANGE = 5
    const gyms: Gym[] = await this.gymsRepository.findNearby({
      latitude: userLatitude,
      longitude: userLongitude,
      maxRange: MAX_RANGE,
    })

    return { gyms }
  }
}
