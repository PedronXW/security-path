import { Crypto } from 'test/cryptography/crypto'
import { makeObserver } from 'test/factories/observer-factory'
import { InMemoryObserverRepository } from 'test/repositories/InMemoryObserverRepository'
import { WrongCredentialError } from '../../errors/WrongCredentialsError'
import { ChangePasswordService } from './change-password'

let sut: ChangePasswordService
let inMemoryObserverRepository: InMemoryObserverRepository
let crypto: Crypto

describe('ChangePassword', () => {
  beforeEach(() => {
    inMemoryObserverRepository = new InMemoryObserverRepository()
    crypto = new Crypto()
    sut = new ChangePasswordService(inMemoryObserverRepository, crypto, crypto)
  })

  it('should be able to change a observer password', async () => {
    const observer = makeObserver({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: await crypto.hash('any_password'),
    })

    await inMemoryObserverRepository.createObserver(observer)

    const result = await sut.execute(
      observer.id.getValue(),
      'any_password',
      'new_password',
    )

    expect(result.isRight()).toBe(true)
    expect(
      await crypto.compare(
        'new_password',
        inMemoryObserverRepository.observers[0].password.toString(),
      ),
    ).toBe(true)
  })

  it('should be able to not change a observer password with a credential error', async () => {
    const observer = makeObserver({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: await crypto.hash('any_password'),
    })

    await inMemoryObserverRepository.createObserver(observer)

    const result = await sut.execute(
      observer.id.getValue(),
      'any_p',
      'new_password',
    )

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(WrongCredentialError)
  })
})
