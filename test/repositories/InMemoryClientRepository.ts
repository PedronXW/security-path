import { DomainEvents } from '@/@shared/events/event-dispatcher'
import {
  ClientRepository,
  EditClient,
} from '@/domain/application/repositories/client-repository'
import { Client } from '@/domain/enterprise/entities/client'
import { ClientMapper } from 'test/repositories/mappers/client-mapper'

export class InMemoryClientRepository implements ClientRepository {
  clients: Client[] = []

  async createClient(client: Client): Promise<Client> {
    this.clients.push(client)

    DomainEvents.markAggregateForDispatch(client)

    DomainEvents.dispatchEventsForAggregate(client.id)

    return client
  }

  async changePassword(id: string, password: string): Promise<Client> {
    const clientIndex = this.clients.findIndex((c) => c.id.getValue() === id)

    this.clients[clientIndex].password = password
    this.clients[clientIndex].updatedAt = new Date()

    return ClientMapper.toDomain(this.clients[clientIndex])
  }

  async verifyClientEmail(id: string): Promise<Client> {
    const clientIndex = this.clients.findIndex((c) => c.id.getValue() === id)

    this.clients[clientIndex].emailVerified = true
    this.clients[clientIndex].updatedAt = new Date()

    return this.clients[clientIndex]
  }

  async getClientByEmail(email: string): Promise<Client | null> {
    const client = this.clients.find((c) => c.email === email)

    if (!client) return null

    return client
  }

  async getClientById(id: string): Promise<Client | null> {
    const client = this.clients.find((c) => c.id.getValue() === id)

    if (!client) return null

    return client
  }

  async deleteClient(id: string): Promise<boolean> {
    const clientIndex = this.clients.findIndex((c) => c.id.getValue() === id)

    this.clients.splice(clientIndex, 1)

    return true
  }

  async editClient(id: string, { name, email }: EditClient): Promise<Client> {
    const clientIndex = this.clients.findIndex((c) => c.id.getValue() === id)

    if (clientIndex === -1) throw new Error('Client not found')

    this.clients[clientIndex].updatedAt = new Date()

    if (name) this.clients[clientIndex].name = name
    if (email) this.clients[clientIndex].email = email

    return this.clients[clientIndex]
  }

  async getAllClients(page: number, limit: number): Promise<Client[]> {
    const startIndex = (page - 1) * limit

    const endIndex = page * limit

    return this.clients.slice(startIndex, endIndex)
  }
}
