import { Prisma, CheckIn } from '@prisma/client'

export interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  save(checkIn: CheckIn): Promise<CheckIn>
  findById(id: string): Promise<CheckIn | null>
  findByUserIdToday(userId: string): Promise<CheckIn | null>
  findManyByUserId(
    userId: string,
    page: number,
    size: number,
  ): Promise<CheckIn[] | null>
  getTotalCheckInsByUserId(userId: string): Promise<number>
}
