
import { EnvService } from '@/infra/env/env.service'
import { ConfigService } from '@nestjs/config'
import { Crypto } from 'test/cryptography/crypto'
import { Encrypter } from 'test/cryptography/encrypter'
import { makeClient } from 'test/factories/client-factory'
import { InMemoryClientRepository } from 'test/repositories/InMemoryClientRepository'
import { ClientNonExistsError } from '../../errors/ClientNonExists'
import { ResetClientPasswordService } from './reset-password'

let sut: ResetClientPasswordService
let inMemoryClientRepository: InMemoryClientRepository
let crypto: Crypto
let encrypter: Encrypter
let env: EnvService
describe('ResetClientPassword', () => {
  beforeEach(() => {
    crypto = new Crypto()
    encrypter = new Encrypter()
    env = new EnvService(new ConfigService({
      'JWT_SECRET': 'any_secret',
      'RESET_PASSWORD_SECRET': 'any_secret',
    }))
    inMemoryClientRepository = new InMemoryClientRepository()
    sut = new ResetClientPasswordService(
      inMemoryClientRepository,
      crypto,
      encrypter,
      env
    )
  })

  it('should be able to reset a client password', async () => {
    const client = makeClient({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: await crypto.hash('any_password'),
    })

    await inMemoryClientRepository.createClient(client)

    const id = await encrypter.encrypt(
      { id: client.id.getValue() },
      env.get('RESET_PASSWORD_SECRET'),
    )

    const result = await sut.execute({
      id,
      password: 'new_password',
    })

    expect(result.isRight()).toBe(true)
    expect(
      await crypto.compare(
        'new_password',
        inMemoryClientRepository.clients[0].password.toString(),
      ),
    ).toEqual(true)
  })

  it('should be able to not reset a client password a wrong id', async () => {
    const client = makeClient({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: await crypto.hash('any_password'),
    })

    await inMemoryClientRepository.createClient(client)

    const id = await encrypter.encrypt(
      { id: 'wrong id' },
      env.get('RESET_PASSWORD_SECRET'),
    )

    const result = await sut.execute({
      id,
      password: 'new_password',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ClientNonExistsError)
  })
})
