import { Either, left, right } from '@/@shared/either'
import { Client } from '@/domain/enterprise/entities/client'
import { Injectable } from '@nestjs/common'
import { ClientNonExistsError } from '../../errors/ClientNonExists'
import { ClientRepository } from '../../repositories/client-repository'

type FindClientByIdServiceRequest = {
  id: string
}

type FindClientByIdServiceResponse = Either<ClientNonExistsError, Client>

@Injectable()
export class FindClientByIdService {
  constructor(private clientRepository: ClientRepository) {}

  async execute({
    id,
  }: FindClientByIdServiceRequest): Promise<FindClientByIdServiceResponse> {
    const client = await this.clientRepository.getClientById(id)

    if (!client) {
      return left(new ClientNonExistsError())
    }

    return right(client)
  }
}
