import { makeObserver } from 'test/factories/observer-factory'
import { InMemoryObserverRepository } from 'test/repositories/InMemoryObserverRepository'
import { ObserverNonExistsError } from '../../errors/ObserverNonExists'
import { FindObserverByIdService } from './find-by-id'

let sut: FindObserverByIdService
let inMemoryObserverRepository: InMemoryObserverRepository

describe('Find Observer By ID', () => {
  beforeEach(() => {
    inMemoryObserverRepository = new InMemoryObserverRepository()
    sut = new FindObserverByIdService(inMemoryObserverRepository)
  })

  it('should be able to find a observer by id', async () => {
    const observer = makeObserver({
      name: 'any_name',
      email: 'any_email@gmail.com',
    })

    await inMemoryObserverRepository.createObserver(observer)

    const result = await sut.execute({ id: observer.id.getValue() })

    expect(result.isRight()).toBe(true)
    expect(inMemoryObserverRepository.observers[0].name).toEqual('any_name')
  })

  it('should be able to not find a observer because a wrong id', async () => {
    const observer = makeObserver({
      name: 'any_name',
      email: 'any_email@gmail.com',
    })

    await inMemoryObserverRepository.createObserver(observer)

    const result = await sut.execute({ id: 'wrong id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ObserverNonExistsError)
  })
})
