import { EnvService } from '@/infra/env/env.service'
import { ConfigService } from '@nestjs/config'
import { Crypto } from 'test/cryptography/crypto'
import { Encrypter } from 'test/cryptography/encrypter'
import { makeClient } from 'test/factories/client-factory'
import { InMemoryClientRepository } from 'test/repositories/InMemoryClientRepository'
import { ClientNonExistsError } from '../../errors/ClientNonExists'
import { VerifyClientEmailService } from './verify-email'

let sut: VerifyClientEmailService
let inMemoryClientRepository: InMemoryClientRepository
let crypto: Crypto
let env: EnvService
let encrypter: Encrypter
describe('VerifyClientEmail', () => {
  beforeEach(() => {
    crypto = new Crypto()
    encrypter = new Encrypter()
    env = new EnvService(new ConfigService({
      'JWT_SECRET': 'any_secret',
      'RESET_PASSWORD_SECRET': 'any_secret',
      'VERIFY_EMAIL_SECRET': 'any_secret',
    }))
    inMemoryClientRepository = new InMemoryClientRepository()
    sut = new VerifyClientEmailService(inMemoryClientRepository, encrypter, env)
  })

  it('should be able to verify a client email', async () => {
    const client = makeClient({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: await crypto.hash('any_password'),
    })

    await inMemoryClientRepository.createClient(client)

    const id = await encrypter.encrypt(
      { id: client.id.getValue() },
      env.get('VERIFY_EMAIL_SECRET'),
    )

    const result = await sut.execute({ id })

    expect(result.isRight()).toBe(true)
    expect(inMemoryClientRepository.clients[0].name).toEqual('any_name')
    expect(inMemoryClientRepository.clients[0].emailVerified).toEqual(true)
  })

  it('should not be able to verify a client email because a wrong id', async () => {
    const client = makeClient({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: await crypto.hash('any_password'),
    })

    await inMemoryClientRepository.createClient(client)

    const id = await encrypter.encrypt(
      { id: 'wrong id' },
      env.get('VERIFY_EMAIL_SECRET'),
    )

    const result = await sut.execute({ id })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ClientNonExistsError)
  })
})
