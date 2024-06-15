import type { CheckIn } from '@prisma/client'
import { CheckInsRepository } from '@/repositories/check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import dayjs from 'dayjs'
import { CheckInValidationExpiredError } from './errors/check-in-validation-expired-error'

interface IValidateCheckInUseCaseRequest {
  checkInId: string
}

interface IValidateCheckInCaseResponse {
  validatedCheckIn: CheckIn
}

export class ValidateCheckInUseCase {
  private checkInsRepository: CheckInsRepository

  constructor(checkInsRepository: CheckInsRepository) {
    this.checkInsRepository = checkInsRepository
  }

  async execute({
    checkInId,
  }: IValidateCheckInUseCaseRequest): Promise<IValidateCheckInCaseResponse> {
    const checkIn = await this.checkInsRepository.findById(checkInId)

    if (!checkIn) throw new ResourceNotFoundError()

    const validationDate = new Date()

    const diffFromCheckInToValidationInMinutes = dayjs(validationDate).diff(
      checkIn.created_at,
      'minutes',
    )

    if (diffFromCheckInToValidationInMinutes > 20) {
      throw new CheckInValidationExpiredError()
    }

    checkIn.validated_at = validationDate

    const validatedCheckIn = await this.checkInsRepository.save(checkIn)

    return {
      validatedCheckIn,
    }
  }
}
