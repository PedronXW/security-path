import { makeClient } from 'test/factories/client-factory'
import { InMemoryClientRepository } from 'test/repositories/InMemoryClientRepository'
import { ClientNonExistsError } from '../../errors/ClientNonExists'
import { FindClientByEmailService } from './find-by-email'

let sut: FindClientByEmailService
let inMemoryClientRepository: InMemoryClientRepository

describe('Find Client By Email', () => {
  beforeEach(() => {
    inMemoryClientRepository = new InMemoryClientRepository()
    sut = new FindClientByEmailService(inMemoryClientRepository)
  })

  it('should be able to find a client by email', async () => {
    const client = makeClient({
      name: 'any_name',
      email: 'any_email@gmail.com',
    })

    await inMemoryClientRepository.createClient(client)

    const result = await sut.execute({ email: client.email })

    expect(result.isRight()).toBe(true)
    expect(inMemoryClientRepository.clients[0].name).toEqual('any_name')
  })

  it('should be able to not find a client by email because a wrong email', async () => {
    const client = makeClient({
      name: 'any_name',
      email: 'any_email@gmail.com',
    })

    await inMemoryClientRepository.createClient(client)

    const result = await sut.execute({ email: 'wrongemail@wrong.com' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ClientNonExistsError)
  })
})
