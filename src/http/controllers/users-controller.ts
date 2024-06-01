import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { CreateUserUseCase } from '@/use-cases/create-user'
import { PrismaUsersRepository } from '@/repositories/prisma-repositories/prisma-users-repository'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error'

export async function createUser(request: FastifyRequest, reply: FastifyReply) {
  const createUserBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { name, email, password } = createUserBodySchema.parse(request.body)

  try {
    const prismaUsersRepository = new PrismaUsersRepository()
    const createUserUseCase = new CreateUserUseCase(prismaUsersRepository)

    await createUserUseCase.execute({ name, email, password })
  } catch (error) {
    console.error(error)
    if (error instanceof UserAlreadyExistsError) {
      return reply.status(409).send({
        message: error.message,
      })
    }
    return reply.status(500).send()
  }

  return reply.status(201).send()
}
