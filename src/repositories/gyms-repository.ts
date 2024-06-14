import { Gym, Prisma } from '@prisma/client'

export interface GymsRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findById(id: string): Promise<Gym | null>
  findAll(): Promise<Gym[]>
  search(searchFor: string, page: number, size: number): Promise<Gym[]>
}
