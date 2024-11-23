import { Either, left, right } from '@/@shared/either'
import { Credential } from '@/domain/enterprise/entities/credential'
import { Injectable } from '@nestjs/common'
import { CredentialNonExistsError } from '../../errors/CredentialNonExists'
import { CredentialRepository } from '../../repositories/credential-repository'

type EditCredentialServiceRequest = {
  name?: string
  email?: string
}

type EditCredentialServiceResponse = Either<CredentialNonExistsError, Credential>

@Injectable()
export class EditCredentialService {
  constructor(private credentialRepository: CredentialRepository) {}

  async execute(
    id: string,
    { name, email }: EditCredentialServiceRequest,
  ): Promise<EditCredentialServiceResponse> {
    const credential = await this.credentialRepository.getCredentialById(id)

    if (!credential) {
      return left(new CredentialNonExistsError())
    }

    const updatedCredential = await this.credentialRepository.editCredential(id, {
      name,
      email,
    })

    return right(updatedCredential)
  }
}
