import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { createUserUseCase } from '@/use-cases/create-user'

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const createUserBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = createUserBodySchema.parse(request.body)

  try {
    await createUserUseCase({ name, email, password })
  } catch (error) {
    console.error(error)
    return reply.status(409).send()
  }

  return reply.status(201).send()
}
