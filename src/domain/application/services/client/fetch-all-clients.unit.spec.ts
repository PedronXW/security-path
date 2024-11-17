import { makeClient } from 'test/factories/client-factory'
import { InMemoryClientRepository } from 'test/repositories/InMemoryClientRepository'
import { FetchAllClientsService } from './fetch-all-clients'

let sut: FetchAllClientsService
let inMemoryClientRepository: InMemoryClientRepository

describe('Fetch All Clients', () => {
  beforeEach(() => {
    inMemoryClientRepository = new InMemoryClientRepository()
    sut = new FetchAllClientsService(inMemoryClientRepository)
  })

  it('should be able to fetch all clients', async () => {
    const client = makeClient({
      name: 'any_name',
      email: 'any_email@gmail.com',
    })

    await inMemoryClientRepository.createClient(client)

    const result = await sut.execute(1, 10)

    expect(result.isRight()).toBe(true)
    expect(result.value).toHaveLength(1)
  })

  it('should be able to fetch all clients with a empty page', async () => {
    const client = makeClient({
      name: 'any_name',
      email: 'any_email@gmail.com',
    })

    await inMemoryClientRepository.createClient(client)

    const result = await sut.execute(2, 10)

    expect(result.isRight()).toBe(true)
    expect(result.value).toHaveLength(0)
  })
})
