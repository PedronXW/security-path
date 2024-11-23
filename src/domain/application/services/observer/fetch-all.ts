import { Either, left, right } from '@/@shared/either'
import { Observer } from '@/domain/enterprise/entities/observer'
import { Injectable } from '@nestjs/common'
import { ObserverNonExistsError } from '../../errors/ObserverNonExists'
import { ObserverRepository } from '../../repositories/observer-repository'

type FetchAllObserversServiceResponse = Either<ObserverNonExistsError, Observer[]>

@Injectable()
export class FetchAllObserversService {
  constructor(private observerRepository: ObserverRepository) {}

  async execute(
    page: number,
    limit: number,
  ): Promise<FetchAllObserversServiceResponse> {
    const observer = await this.observerRepository.getAllObservers(page, limit)

    if (!observer) {
      return left(new ObserverNonExistsError())
    }

    return right(observer)
  }
}
