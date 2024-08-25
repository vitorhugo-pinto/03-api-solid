import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  await request(app.server).post('/users').send({
    name: 'Test name',
    email: 'test@name.com',
    password: '123456',
  })

  const authResponse = await request(app.server).post('/authenticate').send({
    email: 'test@name.com',
    password: '123456',
  })

  const { token } = authResponse.body

  return {
    token,
  }
}
