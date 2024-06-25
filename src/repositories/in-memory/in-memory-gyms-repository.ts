import { Gym, Prisma } from '@prisma/client'
import { GymsRepository, IFindNearbyParams } from '../gyms-repository'
import { randomUUID } from 'node:crypto'
import { getDistanceBetweenCoordinates } from '@/utils/distance-between-coordinates'

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = []

  async create(data: Prisma.GymCreateInput) {
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      name: data.name,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.gyms.push(gym)

    return gym
  }

  async findById(id: string) {
    const gym = this.gyms.find((gym) => gym.id === id)

    if (!gym) return null

    return gym
  }

  async findNearby({ latitude, longitude, maxRange }: IFindNearbyParams) {
    const gyms = this.gyms.filter((gym) => {
      const dist = getDistanceBetweenCoordinates({
        from: { latitude, longitude },
        to: {
          latitude: gym.latitude.toNumber(),
          longitude: gym.longitude.toNumber(),
        },
      })
      if (dist <= maxRange) return true
      return false
    })

    return gyms
  }

  async search(searchFor: string, page: number, size: number) {
    const gyms = this.gyms
      .filter((gym) => gym.name.includes(searchFor))
      .slice((page - 1) * size, page * size)

    return gyms
  }
}
