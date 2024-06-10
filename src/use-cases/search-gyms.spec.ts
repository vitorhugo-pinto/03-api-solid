import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let searchGymsUseCase: SearchGymsUseCase

describe('Search for gyms', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    searchGymsUseCase = new SearchGymsUseCase(gymsRepository)
  })

  it('should successfully find gyms by search term', async () => {
    await gymsRepository.create({
      name: 'mock-gym-name-01',
      phone: 'mock-gym-phone',
      description: 'mock-gym-description',
      latitude: 0,
      longitude: 0,
    })

    await gymsRepository.create({
      name: 'mock-name-01',
      phone: 'mock-gym-phone',
      description: 'mock-gym-description',
      latitude: 0,
      longitude: 0,
    })

    await gymsRepository.create({
      name: 'mock-gym-name-02',
      phone: 'mock-gym-phone',
      description: 'mock-gym-description',
      latitude: 0,
      longitude: 0,
    })

    const { gyms } = await searchGymsUseCase.execute({
      searchFor: 'gym',
      page: 1,
      size: 10,
    })

    expect(gyms).toHaveLength(2)
  })

  it('should successfully find gyms by search term', async () => {
    await gymsRepository.create({
      name: 'mock-gym-name-01',
      phone: 'mock-gym-phone',
      description: 'mock-gym-description',
      latitude: 0,
      longitude: 0,
    })

    await gymsRepository.create({
      name: 'mock-name-01',
      phone: 'mock-gym-phone',
      description: 'mock-gym-description',
      latitude: 0,
      longitude: 0,
    })

    await gymsRepository.create({
      name: 'mock-gym-name-02',
      phone: 'mock-gym-phone',
      description: 'mock-gym-description',
      latitude: 0,
      longitude: 0,
    })

    const { gyms } = await searchGymsUseCase.execute({
      searchFor: 'gym',
      page: 1,
      size: 10,
    })

    expect(gyms).toHaveLength(2)
  })

  it('should successfully find gyms by search term paginated', async () => {
    for (let i = 1; i <= 13; i++) {
      await gymsRepository.create({
        name: `mock-gym-name-${i}`,
        phone: 'mock-gym-phone',
        description: 'mock-gym-description',
        latitude: 0,
        longitude: 0,
      })
    }
    const { gyms } = await searchGymsUseCase.execute({
      searchFor: 'gym',
      page: 2,
      size: 10,
    })

    expect(gyms).toHaveLength(3)
  })
})
