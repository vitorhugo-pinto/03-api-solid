import { FastifyReply, FastifyRequest } from 'fastify'
import { makeGetTotalUserCheckInsUseCase } from '@/use-cases/factories/make-get-total-user-check-ins-use-case'

export async function metrics(request: FastifyRequest, reply: FastifyReply) {
  const getTotalUserCheckInsUseCase = makeGetTotalUserCheckInsUseCase()

  const { totalCheckIns } = await getTotalUserCheckInsUseCase.execute({
    userId: request.user.sub,
  })

  return reply.status(200).send({
    totalCheckIns,
  })
}
