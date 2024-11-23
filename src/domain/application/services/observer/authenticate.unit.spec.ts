
import { Crypto } from 'test/cryptography/crypto'
import { Encrypter } from 'test/cryptography/encrypter'
import { makeObserver } from 'test/factories/observer-factory'
import { InMemoryObserverRepository } from 'test/repositories/InMemoryObserverRepository'
import { WrongCredentialError } from '../../errors/WrongCredentialsError'
import { AuthenticateObserverService } from './authenticate'

let sut: AuthenticateObserverService
let inMemoryObserverRepository: InMemoryObserverRepository
let crypto: Crypto
let encrypter: Encrypter

describe('AuthenticateObserver', () => {
  beforeEach(() => {
    inMemoryObserverRepository = new InMemoryObserverRepository()
    crypto = new Crypto()
    encrypter = new Encrypter()
    sut = new AuthenticateObserverService(
      inMemoryObserverRepository,
      crypto,
      encrypter,
    )
  })

  it('should be able to authenticate a observer', async () => {
    const observer = makeObserver({
      name: 'any_name',
      email: 'any_email@gmail.com',
      emailVerified: true,
      password: await crypto.hash('any_password'),
    })

    await inMemoryObserverRepository.createObserver(observer)

    const result = await sut.execute({
      email: 'any_email@gmail.com',
      password: 'any_password',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryObserverRepository.observers[0].name).toEqual('any_name')
    expect(result.value).toHaveProperty('token')
  })

  it('should be able to return a wrong credential error caused by a wrong password', async () => {
    const observer = makeObserver({
      name: 'any_name',
      email: 'any_email@gmail.com',
      emailVerified: true,
      password: await crypto.hash('any_password'),
    })

    await inMemoryObserverRepository.createObserver(observer)

    const result = await sut.execute({
      email: 'any_email@gmail.com',
      password: 'any',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialError)
  })

  it('should be able to return a wrong credential error caused by a wrong email', async () => {
    const observer = makeObserver({
      name: 'any_name',
      email: 'any_email@gmail.com',
      emailVerified: true,
      password: await crypto.hash('any_password'),
    })

    await inMemoryObserverRepository.createObserver(observer)

    const result = await sut.execute({
      email: 'any@gmail.com',
      password: 'any_password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialError)
  })
})
