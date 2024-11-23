import { Either, left, right } from '@/@shared/either'
import { Credential } from '@/domain/enterprise/entities/credential'
import { Injectable } from '@nestjs/common'
import { CredentialNonExistsError } from '../../errors/CredentialNonExists'
import { CredentialRepository } from '../../repositories/credential-repository'

type FetchAllCredentialsServiceResponse = Either<CredentialNonExistsError, Credential[]>

@Injectable()
export class FetchAllCredentialsService {
  constructor(private credentialRepository: CredentialRepository) {}

  async execute(
    page: number,
    limit: number,
  ): Promise<FetchAllCredentialsServiceResponse> {
    const credential = await this.credentialRepository.getAllCredentials(page, limit)

    if (!credential) {
      return left(new CredentialNonExistsError())
    }

    return right(credential)
  }
}
