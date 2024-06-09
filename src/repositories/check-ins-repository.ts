import { Prisma, CheckIn } from '@prisma/client'

export interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  findByUserIdToday(userId: string): Promise<CheckIn | null>
  findManyByUserId(
    userId: string,
    page: number,
    size: number,
  ): Promise<CheckIn[] | null>
}
