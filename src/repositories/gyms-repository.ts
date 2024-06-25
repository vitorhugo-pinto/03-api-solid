import { Gym, Prisma } from '@prisma/client'

export interface IFindNearbyParams {
  latitude: number
  longitude: number
  maxRange: number
}

export interface GymsRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findById(id: string): Promise<Gym | null>
  findNearby(params: IFindNearbyParams): Promise<Gym[]>
  search(searchFor: string, page: number, size: number): Promise<Gym[]>
}
