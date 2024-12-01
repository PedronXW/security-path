import { makeObserver } from 'test/factories/observer-factory'
import { InMemoryObserverRepository } from 'test/repositories/InMemoryObserverRepository'
import { ObserverNonExistsError } from '../../errors/ObserverNonExists'
import { FindObserverByNameService } from './find-by-name'

let sut: FindObserverByNameService
let inMemoryObserverRepository: InMemoryObserverRepository

describe('Find Observer By Name', () => {
  beforeEach(() => {
    inMemoryObserverRepository = new InMemoryObserverRepository()
    sut = new FindObserverByNameService(inMemoryObserverRepository)
  })

  it('should be able to find a observer by name', async () => {
    const observer = makeObserver({
      name: 'any_name',
      name: 'any_name@gmail.com',
    })

    await inMemoryObserverRepository.createObserver(observer)

    const result = await sut.execute({ name: observer.name })

    expect(result.isRight()).toBe(true)
    expect(inMemoryObserverRepository.observers[0].name).toEqual('any_name')
  })

  it('should be able to not find a observer by name because a wrong name', async () => {
    const observer = makeObserver({
      name: 'any_name',
    })

    await inMemoryObserverRepository.createObserver(observer)

    const result = await sut.execute({ name: 'any_name' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ObserverNonExistsError)
  })
})
