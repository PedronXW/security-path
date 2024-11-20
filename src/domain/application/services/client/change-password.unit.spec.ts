import { Crypto } from 'test/cryptography/crypto'
import { makeClient } from 'test/factories/client-factory'
import { InMemoryClientRepository } from 'test/repositories/InMemoryClientRepository'
import { WrongCredentialError } from '../../errors/WrongCredentialsError'
import { ChangePasswordService } from './change-password'

let sut: ChangePasswordService
let inMemoryClientRepository: InMemoryClientRepository
let crypto: Crypto

describe('ChangePassword', () => {
  beforeEach(() => {
    inMemoryClientRepository = new InMemoryClientRepository()
    crypto = new Crypto()
    sut = new ChangePasswordService(inMemoryClientRepository, crypto, crypto)
  })

  it('should be able to change a client password', async () => {
    const client = makeClient({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: await crypto.hash('any_password'),
    })

    await inMemoryClientRepository.createClient(client)

    const result = await sut.execute(
      client.id.getValue(),
      'any_password',
      'new_password',
    )

    expect(result.isRight()).toBe(true)
    expect(
      await crypto.compare(
        'new_password',
        inMemoryClientRepository.clients[0].password.toString(),
      ),
    ).toBe(true)
  })

  it('should be able to not change a client password with a credential error', async () => {
    const client = makeClient({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: await crypto.hash('any_password'),
    })

    await inMemoryClientRepository.createClient(client)

    const result = await sut.execute(
      client.id.getValue(),
      'any_p',
      'new_password',
    )

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialError)
  })
})
