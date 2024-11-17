import { makeClient } from 'test/factories/client-factory'
import { InMemoryClientRepository } from 'test/repositories/InMemoryClientRepository'
import { ClientNonExistsError } from '../../errors/ClientNonExists'
import { DeleteClientService } from './delete-client'

let sut: DeleteClientService
let inMemoryClientRepository: InMemoryClientRepository

describe('DeleteClient', () => {
  beforeEach(() => {
    inMemoryClientRepository = new InMemoryClientRepository()
    sut = new DeleteClientService(inMemoryClientRepository)
  })

  it('should be able to delete a client', async () => {
    const client = makeClient({
      name: 'any_name',
      email: 'any_email@gmail.com',
    })

    await inMemoryClientRepository.createClient(client)

    const result = await sut.execute({ id: client.id.getValue() })

    expect(result.isRight()).toBe(true)
    expect(inMemoryClientRepository.clients).toHaveLength(0)
  })

  it('should be able to not delete a client because a wrong id', async () => {
    const client = makeClient({
      name: 'any_name',
      email: 'any_email@gmail.com',
    })

    await inMemoryClientRepository.createClient(client)

    const result = await sut.execute({ id: 'wrong id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ClientNonExistsError)
    expect(inMemoryClientRepository.clients).toHaveLength(1)
  })
})
