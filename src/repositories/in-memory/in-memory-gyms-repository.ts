import { Gym, Prisma } from '@prisma/client'
import { GymsRepository } from '../gyms-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryGymsRepository implements GymsRepository {
  public gyms: Gym[] = []

  async create(data: Prisma.GymCreateInput) {
    console.log(data)
    const gym: Gym = {
      id: data.id ?? randomUUID(),
      name: data.name,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.latitude.toString()),
      created_at: new Date(),
    }

    this.gyms.push(gym)

    return gym
  }

  async findById(id: string) {
    console.log(this.gyms)
    const gym = this.gyms.find((gym) => gym.id === id)

    if (!gym) return null

    return gym
  }
}