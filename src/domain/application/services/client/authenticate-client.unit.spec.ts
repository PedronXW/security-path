import { Crypto } from '@/infra/cryptography/crypto'
import { Encrypter } from '@/infra/cryptography/encrypter'
import { makeClient } from 'test/factories/client-factory'
import { InMemoryClientRepository } from 'test/repositories/InMemoryClientRepository'
import { WrongCredentialError } from '../../errors/WrongCredentialsError'
import { AuthenticateClientService } from './authenticate-client'

let sut: AuthenticateClientService
let inMemoryClientRepository: InMemoryClientRepository
let crypto: Crypto
let encrypter: Encrypter

describe('AuthenticateClient', () => {
  beforeEach(() => {
    inMemoryClientRepository = new InMemoryClientRepository()
    crypto = new Crypto()
    encrypter = new Encrypter()
    sut = new AuthenticateClientService(
      inMemoryClientRepository,
      crypto,
      encrypter,
    )
  })

  it('should be able to authenticate a client', async () => {
    const client = makeClient({
      name: 'any_name',
      email: 'any_email@gmail.com',
      emailVerified: true,
      password: await crypto.hash('any_password'),
    })

    await inMemoryClientRepository.createClient(client)

    const result = await sut.execute({
      email: 'any_email@gmail.com',
      password: 'any_password',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryClientRepository.clients[0].name).toEqual('any_name')
    expect(result.value).toHaveProperty('token')
  })

  it('should be able to return a wrong credential error caused by a wrong password', async () => {
    const client = makeClient({
      name: 'any_name',
      email: 'any_email@gmail.com',
      emailVerified: true,
      password: await crypto.hash('any_password'),
    })

    await inMemoryClientRepository.createClient(client)

    const result = await sut.execute({
      email: 'any_email@gmail.com',
      password: 'any',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialError)
  })

  it('should be able to return a wrong credential error caused by a wrong email', async () => {
    const client = makeClient({
      name: 'any_name',
      email: 'any_email@gmail.com',
      emailVerified: true,
      password: await crypto.hash('any_password'),
    })

    await inMemoryClientRepository.createClient(client)

    const result = await sut.execute({
      email: 'any@gmail.com',
      password: 'any_password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialError)
  })
})
