import { Either, left, right } from '@/@shared/either'
import { Observer } from '@/domain/enterprise/entities/observer'
import { Injectable } from '@nestjs/common'
import { ObserverNonExistsError } from '../../errors/ObserverNonExists'
import { ObserverRepository } from '../../repositories/observer-repository'

type FindObserverByNameServiceRequest = {
  name: string
}

type FindObserverByNameServiceResponse = Either<ObserverNonExistsError, Observer>

@Injectable()
export class FindObserverByNameService {
  constructor(private observerRepository: ObserverRepository) {}

  async execute({
    name,
  }: FindObserverByNameServiceRequest): Promise<FindObserverByNameServiceResponse> {
    const observer = await this.observerRepository.getObserverByName(name)

    if (!observer) {
      return left(new ObserverNonExistsError())
    }

    return right(observer)
  }
}
