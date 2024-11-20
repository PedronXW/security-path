import { EnvService } from '@/infra/env/env.service'
import { ConfigService } from '@nestjs/config'
import { Crypto } from 'test/cryptography/crypto'
import { Encrypter } from 'test/cryptography/encrypter'
import { makeClient } from 'test/factories/client-factory'
import { InMemoryClientRepository } from 'test/repositories/InMemoryClientRepository'
import { ClientNonExistsError } from '../../errors/ClientNonExists'
import { SendVerificationClientEmailService } from './send-verification-email'

let sut: SendVerificationClientEmailService
let inMemoryClientRepository: InMemoryClientRepository
let crypto: Crypto
let env: EnvService
let encrypter: Encrypter
describe('SendVerificationClientEmail', () => {
  beforeEach(() => {
    crypto = new Crypto()
    encrypter = new Encrypter()
    env = new EnvService(new ConfigService({
      'JWT_SECRET': 'any_secret',
      'RESET_PASSWORD_SECRET': 'any_secret',
      'VERIFY_EMAIL_SECRET': 'any_secret',
    }))
    inMemoryClientRepository = new InMemoryClientRepository()
    sut = new SendVerificationClientEmailService(
      inMemoryClientRepository,
      encrypter,
      env,
    )
  })

  it('should be able to send a verification client email', async () => {
    const client = makeClient({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: await crypto.hash('any_password'),
    })

    await inMemoryClientRepository.createClient(client)

    const result = await sut.execute({ id: client.id.getValue() })

    const encryptedId = await encrypter.decrypt(
      result.value as string,
      env.get('VERIFY_EMAIL_SECRET'),
    )

    expect(result.isRight()).toBe(true)
    expect(encryptedId).toEqual(client.id.getValue())
  })

  it('should not be able to send a verification client email because a wrong id', async () => {
    const client = makeClient({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: await crypto.hash('any_password'),
    })

    await inMemoryClientRepository.createClient(client)

    const result = await sut.execute({ id: 'wrong id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ClientNonExistsError)
  })
})
