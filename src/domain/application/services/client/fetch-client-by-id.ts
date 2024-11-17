import { Either, left, right } from '@/@shared/either'
import { Client } from '@/domain/enterprise/entities/client'
import { Injectable } from '@nestjs/common'
import { ClientNonExistsError } from '../../errors/ClientNonExists'
import { ClientRepository } from '../../repositories/client-repository'

type FetchClientByIdServiceRequest = {
  id: string
}

type FetchClientByIdServiceResponse = Either<ClientNonExistsError, Client>

@Injectable()
export class FetchClientByIdService {
  constructor(private clientRepository: ClientRepository) {}

  async execute({
    id,
  }: FetchClientByIdServiceRequest): Promise<FetchClientByIdServiceResponse> {
    const client = await this.clientRepository.getClientById(id)

    if (!client) {
      return left(new ClientNonExistsError())
    }

    return right(client)
  }
}
