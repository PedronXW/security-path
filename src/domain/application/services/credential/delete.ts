import { Either, left, right } from '@/@shared/either'
import { Injectable } from '@nestjs/common'
import { CredentialNonExistsError } from '../../errors/CredentialNonExists'
import { CredentialRepository } from '../../repositories/credential-repository'

type DeleteCredentialServiceRequest = {
  id: string
}

type DeleteCredentialServiceResponse = Either<CredentialNonExistsError, boolean>

@Injectable()
export class DeleteCredentialService {
  constructor(private credentialRepository: CredentialRepository) {}

  async execute({
    id,
  }: DeleteCredentialServiceRequest): Promise<DeleteCredentialServiceResponse> {
    const credential = await this.credentialRepository.getCredentialById(id)

    if (!credential) {
      return left(new CredentialNonExistsError())
    }

    const result = await this.credentialRepository.deleteCredential(id)

    return right(result)
  }
}
