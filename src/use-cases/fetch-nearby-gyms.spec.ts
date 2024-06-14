import { describe, it, expect, afterEach, beforeEach, vi } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let fetchNearbyGymsUseCase: FetchNearbyGymsUseCase

describe('Fetch nearby gyms', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    fetchNearbyGymsUseCase = new FetchNearbyGymsUseCase(gymsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should successfully fetch gyms nearby the user', async () => {
    await gymsRepository.create({
      name: 'mock-gym-forte-reis-magos',
      phone: 'mock-gym-phone',
      description: 'mock-gym-description',
      latitude: -5.7697701,
      longitude: -35.2225612,
    })

    await gymsRepository.create({
      name: 'mock-gym-reference',
      phone: 'mock-gym-phone',
      description: 'mock-gym-description',
      latitude: -5.8212595,
      longitude: -35.2205149,
    })

    await gymsRepository.create({
      name: 'mock-gym-morro-careca',
      phone: 'mock-gym-phone',
      description: 'mock-gym-description',
      latitude: -5.8822698,
      longitude: -35.1714643,
    })

    await gymsRepository.create({
      name: 'mock-gym-natal-shopping',
      phone: 'mock-gym-phone',
      description: 'mock-gym-description',
      latitude: -5.8420136,
      longitude: -35.2122102,
    })

    const { gyms } = await fetchNearbyGymsUseCase.execute({
      userLatitude: -5.822714,
      userLongitude: -35.2053797,
    })

    expect(gyms).toBeTruthy()
    expect(gyms).toHaveLength(2)
  })
})
