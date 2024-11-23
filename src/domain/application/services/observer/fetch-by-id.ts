import { Either, left, right } from '@/@shared/either'
import { Observer } from '@/domain/enterprise/entities/observer'
import { Injectable } from '@nestjs/common'
import { ObserverNonExistsError } from '../../errors/ObserverNonExists'
import { ObserverRepository } from '../../repositories/observer-repository'

type FetchObserverByIdServiceRequest = {
  id: string
}

type FetchObserverByIdServiceResponse = Either<ObserverNonExistsError, Observer>

@Injectable()
export class FetchObserverByIdService {
  constructor(private observerRepository: ObserverRepository) {}

  async execute({
    id,
  }: FetchObserverByIdServiceRequest): Promise<FetchObserverByIdServiceResponse> {
    const observer = await this.observerRepository.getObserverById(id)

    if (!observer) {
      return left(new ObserverNonExistsError())
    }

    return right(observer)
  }
}
