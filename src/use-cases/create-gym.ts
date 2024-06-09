import type { Gym } from '@prisma/client'
import { GymsRepository } from '@/repositories/gyms-repository'

interface ICreateGymUseCase {
  name: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
}

interface ICreateGymCaseResponse {
  gym: Gym
}

export class CreateGymUseCase {
  private gymsRepository: GymsRepository

  constructor(gymsRepository: GymsRepository) {
    this.gymsRepository = gymsRepository
  }

  async execute({
    name,
    description,
    phone,
    latitude,
    longitude,
  }: ICreateGymUseCase): Promise<ICreateGymCaseResponse> {
    const gymCreated = await this.gymsRepository.create({
      name,
      description,
      phone,
      latitude,
      longitude,
    })

    return {
      gym: gymCreated,
    }
  }
}
