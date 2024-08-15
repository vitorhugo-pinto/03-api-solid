import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeFetchUserCheckInsUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-use-case'

export async function history(request: FastifyRequest, reply: FastifyReply) {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(10).default(10),
  })

  const { page, size } = checkInHistoryQuerySchema.parse(request.query)

  const fetchUserCheckInsUseCase = makeFetchUserCheckInsUseCase()

  const { checkIns } = await fetchUserCheckInsUseCase.execute({
    userId: request.user.sub,
    page,
    size,
  })

  return reply.status(200).send({
    checkIns,
  })
}
