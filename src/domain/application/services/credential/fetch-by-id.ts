import { Either, left, right } from '@/@shared/either'
import { Credential } from '@/domain/enterprise/entities/credential'
import { Injectable } from '@nestjs/common'
import { CredentialNonExistsError } from '../../errors/CredentialNonExists'
import { CredentialRepository } from '../../repositories/credential-repository'

type FetchCredentialByIdServiceRequest = {
  id: string
}

type FetchCredentialByIdServiceResponse = Either<CredentialNonExistsError, Credential>

@Injectable()
export class FetchCredentialByIdService {
  constructor(private credentialRepository: CredentialRepository) {}

  async execute({
    id,
  }: FetchCredentialByIdServiceRequest): Promise<FetchCredentialByIdServiceResponse> {
    const credential = await this.credentialRepository.getCredentialById(id)

    if (!credential) {
      return left(new CredentialNonExistsError())
    }

    return right(credential)
  }
}
