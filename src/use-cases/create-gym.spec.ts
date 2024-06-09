import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

let gymsRepository: InMemoryGymsRepository
let createGymUseCase: CreateGymUseCase

describe('Create gym use case', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    createGymUseCase = new CreateGymUseCase(gymsRepository)
  })

  it('should successfully create a gym', async () => {
    const { gym } = await createGymUseCase.execute({
      name: 'mock-gym-name',
      phone: 'mock-gym-phone',
      description: 'mock-gym-description',
      latitude: 0,
      longitude: 0,
    })

    expect(gym).toBeTruthy()
  })
})
