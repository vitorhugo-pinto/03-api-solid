import { FastifyInstance } from 'fastify'
import { createUser } from './create'
import { authenticateUser } from './authenticate'
import { myProfile } from './my-profile'
import { verifyJwt } from '../../middlewares/verify-jwt'

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', createUser)
  app.post('/authenticate', authenticateUser)

  app.get('/my-profile', { onRequest: [verifyJwt] }, myProfile)
}
