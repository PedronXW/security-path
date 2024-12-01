import { Either, left, right } from '@/@shared/either'
import { Client } from '@/domain/enterprise/entities/client'
import { Injectable } from '@nestjs/common'
import { ClientNonExistsError } from '../../errors/ClientNonExists'
import { ClientRepository } from '../../repositories/client-repository'

type FindClientByEmailServiceRequest = {
  email: string
}

type FindClientByEmailServiceResponse = Either<ClientNonExistsError, Client>

@Injectable()
export class FindClientByEmailService {
  constructor(private clientRepository: ClientRepository) {}

  async execute({
    email,
  }: FindClientByEmailServiceRequest): Promise<FindClientByEmailServiceResponse> {
    const client = await this.clientRepository.getClientByEmail(email)

    if (!client) {
      return left(new ClientNonExistsError())
    }

    return right(client)
  }
}
