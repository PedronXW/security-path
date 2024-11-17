import { Either, left, right } from '@/@shared/either'
import { Client } from '@/domain/enterprise/entities/client'
import { Injectable } from '@nestjs/common'
import { HashComparer } from '../../criptography/hash-comparer'
import { HashGenerator } from '../../criptography/hash-generator'
import { ClientNonExistsError } from '../../errors/ClientNonExists'
import { WrongCredentialError } from '../../errors/WrongCredentialsError'
import { ClientRepository } from '../../repositories/client-repository'

type ChangePasswordServiceResponse = Either<ClientNonExistsError, Client>

@Injectable()
export class ChangePasswordService {
  constructor(
    private readonly clientRepository: ClientRepository,
    private hashComparer: HashComparer,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(
    id: string,
    password: string,
    newPassword: string,
  ): Promise<ChangePasswordServiceResponse> {
    const client = await this.clientRepository.getClientById(id)

    if (!client) {
      return left(new ClientNonExistsError())
    }

    const passwordMatch = await this.hashComparer.compare(
      password,
      client.password,
    )

    if (!passwordMatch) {
      return left(new WrongCredentialError())
    }

    const editResult = await this.clientRepository.changePassword(
      id,
      await this.hashGenerator.hash(newPassword),
    )

    return right(editResult)
  }
}
