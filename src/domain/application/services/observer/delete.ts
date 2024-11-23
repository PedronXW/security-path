import { Either, left, right } from '@/@shared/either'
import { Injectable } from '@nestjs/common'
import { ObserverNonExistsError } from '../../errors/ObserverNonExists'
import { ObserverRepository } from '../../repositories/observer-repository'

type DeleteObserverServiceRequest = {
  id: string
}

type DeleteObserverServiceResponse = Either<ObserverNonExistsError, boolean>

@Injectable()
export class DeleteObserverService {
  constructor(private observerRepository: ObserverRepository) {}

  async execute({
    id,
  }: DeleteObserverServiceRequest): Promise<DeleteObserverServiceResponse> {
    const observer = await this.observerRepository.getObserverById(id)

    if (!observer) {
      return left(new ObserverNonExistsError())
    }

    const result = await this.observerRepository.deleteObserver(id)

    return right(result)
  }
}
