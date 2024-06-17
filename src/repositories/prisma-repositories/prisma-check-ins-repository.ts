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

  async save(data: CheckIn) {
    const checkIn = await prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data,
    })

    return checkIn
  }

  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
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
      skip: (page - 1) * size,
      take: size,
      where: {
        user_id: userId,
      },
    })

    return checkIns
  }

  async getTotalCheckInsByUserId(userId: string) {
    const totalCheckIns: number = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })

    return totalCheckIns
  }
}
