import { prisma } from '@/lib/prisma'
import { CheckIn, Prisma } from '@prisma/client'
import { CheckInsRepository } from '../check-ins-repository'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements CheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = await prisma.checkIn.create({
      data,
    })

    return checkIn
  }

  async findByUserIdToday(userId: string) {
    const dateNow = dayjs(new Date())
    const startOfTheDay = dayjs(dateNow).startOf('date')
    const checkIn = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: dateNow.toDate(),
        },
      },
    })

    return checkIn
  }

  async findManyByUserId(userId: string, page: number, size: number) {
    const checkIns: CheckIn[] = await prisma.checkIn.findMany({
      skip: page * size,
      take: size,
      where: {
        user_id: userId,
      },
    })

    return checkIns
  }
}
