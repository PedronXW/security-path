import { Either, left, right } from '@/@shared/either'
import { Client } from '@/domain/enterprise/entities/client'
import { Injectable } from '@nestjs/common'
import { ClientNonExistsError } from '../../errors/ClientNonExists'
import { ClientRepository } from '../../repositories/client-repository'

type FetchAllClientsServiceResponse = Either<ClientNonExistsError, Client[]>

@Injectable()
export class FetchAllClientsService {
  constructor(private clientRepository: ClientRepository) {}

  async execute(
    page: number,
    limit: number,
  ): Promise<FetchAllClientsServiceResponse> {
    const client = await this.clientRepository.getAllClients(page, limit)

    if (!client) {
      return left(new ClientNonExistsError())
    }

    return right(client)
  }
}
