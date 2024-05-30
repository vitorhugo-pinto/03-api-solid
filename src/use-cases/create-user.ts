import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

interface ICreateUserUseCase {
  name: string
  email: string
  password: string
}

export async function createUserUseCase({
  name,
  email,
  password,
}: ICreateUserUseCase) {
  const userWithSameEmail = await prisma.user.findUnique({
    where: {
      email,
    },
  })

  if (userWithSameEmail) throw new Error('Email already in use')

  const hashedPassword = await hash(password, 6)

  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })
}
