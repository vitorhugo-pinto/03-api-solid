import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'

describe('My profile controller', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should successfully request a user profile', async () => {
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

    const profileResponse = await request(app.server)
      .get('/my-profile')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'test@name.com',
      }),
    )
  })
})
