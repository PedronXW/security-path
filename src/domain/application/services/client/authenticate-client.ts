import { Either, left, right } from '@/@shared/either'
import { Injectable } from '@nestjs/common'
import { Encrypter } from '../../criptography/encrypter'
import { HashComparer } from '../../criptography/hash-comparer'
import { WrongCredentialError } from '../../errors/WrongCredentialsError'
import { ClientRepository } from '../../repositories/client-repository'

type AuthenticateClientServiceRequest = {
  email: string
  password: string
}

type AuthenticateClientServiceResponse = Either<
  WrongCredentialError,
  { token: string }
>

@Injectable()
export class AuthenticateClientService {
  constructor(
    private clientRepository: ClientRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateClientServiceRequest): Promise<AuthenticateClientServiceResponse> {
    const client = await this.clientRepository.getClientByEmail(email)

    if (!client) {
      return left(new WrongCredentialError())
    }

    const passwordMatch = await this.hashComparer.compare(
      password,
      client.password,
    )

    if (!passwordMatch) {
      return left(new WrongCredentialError())
    }

    const token = await this.encrypter.encrypt({
      id: client.id.getValue(),
    })

    return right({ token })
  }
}
