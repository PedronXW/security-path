import { makeObserver } from 'test/factories/observer-factory'
import { InMemoryObserverRepository } from 'test/repositories/InMemoryObserverRepository'
import { ObserverNonExistsError } from '../../errors/ObserverNonExists'
import { FetchObserverByEmailService } from './fetch-by-name'

let sut: FetchObserverByEmailService
let inMemoryObserverRepository: InMemoryObserverRepository

describe('Fetch Observer By Email', () => {
  beforeEach(() => {
    inMemoryObserverRepository = new InMemoryObserverRepository()
    sut = new FetchObserverByEmailService(inMemoryObserverRepository)
  })

  it('should be able to fetch a observer by email', async () => {
    const observer = makeObserver({
      name: 'any_name',
      email: 'any_email@gmail.com',
    })

    await inMemoryObserverRepository.createObserver(observer)

    const result = await sut.execute({ name: observer.name })

    expect(result.isRight()).toBe(true)
    expect(inMemoryObserverRepository.observers[0].name).toEqual('any_name')
  })

  it('should be able to not fetch a observer by email because a wrong name', async () => {
    const observer = makeObserver({
      name: 'any_name',
    })

    await inMemoryObserverRepository.createObserver(observer)

    const result = await sut.execute({ name: 'any_name' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ObserverNonExistsError)
  })
})
