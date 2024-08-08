import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'

describe('Authenticate controller', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should successfully authenticate a user', async () => {
    await request(app.server).post('/users').send({
      name: 'Test name',
      email: 'test@name.com',
      password: '123456',
    })

    const response = await request(app.server).post('/authenticate').send({
      email: 'test@name.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
  })
})
