import { Crypto } from '@/infra/cryptography/crypto'
import { InMemoryClientRepository } from 'test/repositories/InMemoryClientRepository'
import { CreateClientService } from './create-client'

let sut: CreateClientService
let inMemoryClientRepository: InMemoryClientRepository
let crypto: Crypto

describe('CreateClient', () => {
  beforeEach(() => {
    inMemoryClientRepository = new InMemoryClientRepository()
    crypto = new Crypto()
    sut = new CreateClientService(inMemoryClientRepository, crypto)
  })

  it('should be able to create a client', async () => {
    const result = await sut.execute({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryClientRepository.clients[0].name).toEqual('any_name')
  })
})
