import { Either, left, right } from '@/@shared/either'
import { Injectable } from '@nestjs/common'
import { Encrypter } from '../../criptography/encrypter'
import { HashComparer } from '../../criptography/hash-comparer'
import { WrongCredentialError } from '../../errors/WrongCredentialsError'
import { ObserverRepository } from '../../repositories/observer-repository'

type AuthenticateObserverServiceRequest = {
  name: string
  password: string
}

type AuthenticateObserverServiceResponse = Either<
  WrongCredentialError,
  { token: string }
>

@Injectable()
export class AuthenticateObserverService {
  constructor(
    private observerRepository: ObserverRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    name,
    password,
  }: AuthenticateObserverServiceRequest): Promise<AuthenticateObserverServiceResponse> {
    const observer = await this.observerRepository.getObserverByName(name)

    if (!observer) {
      return left(new WrongCredentialError())
    }

    const passwordMatch = await this.hashComparer.compare(
      password,
      observer.password,
    )

    if (!passwordMatch) {
      return left(new WrongCredentialError())
    }

    const token = await this.encrypter.encrypt({
      id: observer.id.getValue(),
    })

    return right({ token })
  }
}
