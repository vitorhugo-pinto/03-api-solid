import request from 'supertest'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { app } from '@/app'

describe('User controller', () => {
  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  it('should successfully create a user', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'Test name',
      email: 'test@name.com',
      password: '123456',
    })

    expect(response.statusCode).toEqual(201)
  })
})
