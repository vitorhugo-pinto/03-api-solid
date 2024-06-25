import { prisma } from '@/lib/prisma'
import { GymsRepository, IFindNearbyParams } from '../gyms-repository'
import { Gym, Prisma } from '@prisma/client'

export class PrismaGymsRepository implements GymsRepository {
  async create(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    })

    return gym
  }

  async findById(id: string) {
    const gym = await prisma.gym.findUnique({
      where: {
        id,
      },
    })

    return gym
  }

  async findNearby({ latitude, longitude, maxRange }: IFindNearbyParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
      SELECT * from gyms
      WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= ${maxRange}
    `

    return gyms
  }

  async search(searchFor: string, page: number, size: number) {
    const gyms = await prisma.gym.findMany({
      take: size,
      skip: (page - 1) * size,
      where: {
        name: {
          contains: searchFor,
        },
      },
    })
    return gyms
  }
}
