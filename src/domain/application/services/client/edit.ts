import { Either, left, right } from '@/@shared/either'
import { Client } from '@/domain/enterprise/entities/client'
import { Injectable } from '@nestjs/common'
import { ClientNonExistsError } from '../../errors/ClientNonExists'
import { ClientRepository } from '../../repositories/client-repository'

type EditClientServiceRequest = {
  name?: string
  email?: string
}

type EditClientServiceResponse = Either<ClientNonExistsError, Client>

@Injectable()
export class EditClientService {
  constructor(private clientRepository: ClientRepository) {}

  async execute(
    id: string,
    { name, email }: EditClientServiceRequest,
  ): Promise<EditClientServiceResponse> {
    const client = await this.clientRepository.getClientById(id)

    if (!client) {
      return left(new ClientNonExistsError())
    }

    const updatedClient = await this.clientRepository.editClient(id, {
      name,
      email,
    })

    return right(updatedClient)
  }
}
