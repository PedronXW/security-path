import { makeClient } from 'test/factories/client-factory'
import { InMemoryClientRepository } from 'test/repositories/InMemoryClientRepository'
import { ClientNonExistsError } from '../../errors/ClientNonExists'
import { EditClientService } from './edit'

let sut: EditClientService
let inMemoryClientRepository: InMemoryClientRepository

describe('EditClient', () => {
  beforeEach(() => {
    inMemoryClientRepository = new InMemoryClientRepository()
    sut = new EditClientService(inMemoryClientRepository)
  })

  it('should be able to edit a client', async () => {
    const client = makeClient({
      name: 'any_name',
      email: 'any_email@gmail.com',
    })

    await inMemoryClientRepository.createClient(client)

    const result = await sut.execute(client.id.getValue(), {
      name: 'any_name2',
      email: 'any_email2@gmail.com',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryClientRepository.clients[0].name).toEqual('any_name2')
  })

  it('should be able to not edit a client because a wrong id', async () => {
    const client = makeClient({
      name: 'any_name',
      email: 'any_email@gmail.com',
    })

    await inMemoryClientRepository.createClient(client)

    const result = await sut.execute('wrong id', {
      name: 'any_name2',
      email: 'any_email2@gmail.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ClientNonExistsError)
    expect(inMemoryClientRepository.clients[0].name).toEqual('any_name')
    expect(inMemoryClientRepository.clients[0].email).toEqual(
      'any_email@gmail.com',
    )
  })
})
