import { Either, left, right } from '@/@shared/either'
import { Observer } from '@/domain/enterprise/entities/observer'
import { Injectable } from '@nestjs/common'
import { HashComparer } from '../../criptography/hash-comparer'
import { HashGenerator } from '../../criptography/hash-generator'
import { ObserverNonExistsError } from '../../errors/ObserverNonExists'
import { WrongCredentialError } from '../../errors/WrongCredentialsError'
import { ObserverRepository } from '../../repositories/observer-repository'

type ChangePasswordServiceResponse = Either<ObserverNonExistsError, Observer>

@Injectable()
export class ChangePasswordService {
  constructor(
    private readonly observerRepository: ObserverRepository,
    private hashComparer: HashComparer,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(
    id: string,
    password: string,
    newPassword: string,
  ): Promise<ChangePasswordServiceResponse> {
    const observer = await this.observerRepository.getObserverById(id)

    if (!observer) {
      return left(new ObserverNonExistsError())
    }

    const passwordMatch = await this.hashComparer.compare(
      password,
      observer.password,
    )

    if (!passwordMatch) {
      return left(new WrongCredentialError())
    }

    const editResult = await this.observerRepository.changePassword(
      id,
      await this.hashGenerator.hash(newPassword),
    )

    return right(editResult)
  }
}
