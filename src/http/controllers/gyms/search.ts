import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case'

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    searchFor: z.string(),
    page: z.coerce.number().min(1).default(1),
    size: z.coerce.number().min(1).default(10),
  })

  const { searchFor, page, size } = searchGymsQuerySchema.parse(request.query)

  const searchGymsUseCase = makeSearchGymsUseCase()

  const { gyms } = await searchGymsUseCase.execute({
    searchFor,
    page,
    size,
  })

  return reply.status(200).send({
    gyms,
  })
}
