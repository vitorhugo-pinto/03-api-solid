import { GymsRepository } from '@/repositories/gyms-repository'
import { getDistanceBetweenCoordinates } from '@/utils/distance-between-coordinates'
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
    const allGyms: Gym[] = await this.gymsRepository.findAll()

    const gyms = allGyms.filter((gym) => {
      const dist = getDistanceBetweenCoordinates({
        from: { latitude: userLatitude, longitude: userLongitude },
        to: {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      })
      if (dist <= 5) return true
      return false
    })

    return { gyms }
  }
}
