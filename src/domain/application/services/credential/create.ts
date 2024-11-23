import { Either, right } from '@/@shared/either'
import { Credential } from '@/domain/enterprise/entities/credential'
import { Injectable } from '@nestjs/common'
import { CredentialAlreadyExistsError } from '../../errors/CredentialAlreadyExistsError'
import { CredentialRepository } from '../../repositories/credential-repository'

interface CreateCredentialServiceRequest {
  password: string
}

type CreateCredentialServiceResponse = Either<CredentialAlreadyExistsError, Credential>

@Injectable()
export class CreateCredentialService {
  constructor(
    private credentialRepository: CredentialRepository,
  ) {}

  async execute({
    password
  }: CreateCredentialServiceRequest): Promise<CreateCredentialServiceResponse> {
    const credential = Credential.create({
      password
    })

    const newCredential = await this.credentialRepository.createCredential(credential)

    return right(newCredential)
  }
}
