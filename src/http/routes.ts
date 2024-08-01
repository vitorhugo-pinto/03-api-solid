import { FastifyInstance } from 'fastify'
import { createUser } from './controllers/users-controller'
import { authenticateUser } from './controllers/authenticate-controller'
import { myProfile } from './controllers/my-profile-controller'
import { verifyJwt } from './middlewares/verify-jwt'

export async function routes(app: FastifyInstance) {
  app.post('/users', createUser)
  app.post('/authenticate', authenticateUser)

  app.get('/my-profile', { onRequest: [verifyJwt] }, myProfile)
}
