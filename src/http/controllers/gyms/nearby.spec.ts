import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-authenticate-user'

describe('Nearby Gyms (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able list nearby gyms', async () => {
    const { token } = await createAndAuthenticateUser(app)

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'mock-gym-forte-reis-magos',
        phone: 'mock-gym-phone',
        description: 'mock-gym-description',
        latitude: -5.7697701,
        longitude: -35.2225612,
      })

    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'mock-gym-reference',
        phone: 'mock-gym-phone',
        description: 'mock-gym-description',
        latitude: -5.8212595,
        longitude: -35.2205149,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -5.8212595,
        longitude: -35.2205149,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        name: 'mock-gym-reference',
      }),
    ])
  })
})
