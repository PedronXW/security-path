import { Either, left, right } from '@/@shared/either'
import { EnvService } from '@/infra/env/env.service'
import { Injectable } from '@nestjs/common'
import { Encrypter } from '../../criptography/encrypter'
import { ClientEmailAlreadyVerifiedError } from '../../errors/ClientEmailAlreadyVerifiedError'
import { ClientNonExistsError } from '../../errors/ClientNonExists'
import { ClientRepository } from '../../repositories/client-repository'

interface SendVerificationClientEmailServiceRequest {
  id: string
}

type SendVerificationClientEmailServiceResponse = Either<
  ClientNonExistsError | ClientEmailAlreadyVerifiedError,
  string
>

@Injectable()
export class SendVerificationClientEmailService {
  constructor(
    private clientRepository: ClientRepository,
    private encrypter: Encrypter,
    private envService: EnvService
  ) {}

  async execute({
    id,
  }: SendVerificationClientEmailServiceRequest): Promise<SendVerificationClientEmailServiceResponse> {
    const clientExists = await this.clientRepository.getClientById(id)

    if (!clientExists) {
      return left(new ClientNonExistsError())
    }

    if (clientExists.emailVerified) {
      return left(new ClientEmailAlreadyVerifiedError())
    }

    const encryptedId = await this.encrypter.encrypt(
      { id },
      this.envService.get("JWT_SECRET"),
    )

    return right(encryptedId)
  }
}
