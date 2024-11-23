import { Either, left, right } from '@/@shared/either'
import { Observer } from '@/domain/enterprise/entities/observer'
import { Injectable } from '@nestjs/common'
import { ObserverNonExistsError } from '../../errors/ObserverNonExists'
import { ObserverRepository } from '../../repositories/observer-repository'

type FetchObserverByEmailServiceRequest = {
  name: string
}

type FetchObserverByEmailServiceResponse = Either<ObserverNonExistsError, Observer>

@Injectable()
export class FetchObserverByEmailService {
  constructor(private observerRepository: ObserverRepository) {}

  async execute({
    name,
  }: FetchObserverByEmailServiceRequest): Promise<FetchObserverByEmailServiceResponse> {
    const observer = await this.observerRepository.getObserverByName(name)

    if (!observer) {
      return left(new ObserverNonExistsError())
    }

    return right(observer)
  }
}
