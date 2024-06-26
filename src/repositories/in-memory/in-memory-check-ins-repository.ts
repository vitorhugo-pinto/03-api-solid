import { CheckIn, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { CheckInsRepository } from '../check-ins-repository'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements CheckInsRepository {
  public checkIns: CheckIn[] = []

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn: CheckIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.checkIns.push(checkIn)

    return checkIn
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.checkIns.findIndex(
      (savedCheckIn) => savedCheckIn.id === checkIn.id,
    )

    if (checkInIndex >= 0) this.checkIns[checkInIndex] = checkIn

    return checkIn
  }

  async findById(id: string) {
    const checkIn = this.checkIns.find((checkIn) => checkIn.id === id)

    if (!checkIn) return null

    return checkIn
  }

  async findByUserIdToday(userId: string) {
    const dateNow = dayjs(new Date())
    const startOfTheDay = dayjs(dateNow).startOf('date')
    const checkIn = this.checkIns.find((checkIn) => {
      const createdAtVerification = dayjs(checkIn.created_at)
      const isAfterOrSame =
        createdAtVerification.isAfter(startOfTheDay) ||
        createdAtVerification.isSame(startOfTheDay)
      const isBeforeOrSame =
        createdAtVerification.isBefore(dateNow) ||
        createdAtVerification.isSame(dateNow)
      return checkIn.user_id === userId && isAfterOrSame && isBeforeOrSame
    })

    if (!checkIn) return null

    return checkIn
  }

  async findManyByUserId(userId: string, page: number, size: number) {
    const checkIns = this.checkIns
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * size, page * size)

    return checkIns
  }

  async getTotalCheckInsByUserId(userId: string) {
    const totalUserCheckIns = this.checkIns.filter(
      (checkIn) => checkIn.user_id === userId,
    ).length

    return totalUserCheckIns
  }
}
