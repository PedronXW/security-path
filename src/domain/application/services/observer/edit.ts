import { Either, left, right } from '@/@shared/either'
import { Observer } from '@/domain/enterprise/entities/observer'
import { Injectable } from '@nestjs/common'
import { ObserverNonExistsError } from '../../errors/ObserverNonExists'
import { ObserverRepository } from '../../repositories/observer-repository'

type EditObserverServiceRequest = {
  name?: string
  email?: string
}

type EditObserverServiceResponse = Either<ObserverNonExistsError, Observer>

@Injectable()
export class EditObserverService {
  constructor(private observerRepository: ObserverRepository) {}

  async execute(
    id: string,
    { name, email }: EditObserverServiceRequest,
  ): Promise<EditObserverServiceResponse> {
    const observer = await this.observerRepository.getObserverById(id)

    if (!observer) {
      return left(new ObserverNonExistsError())
    }

    const updatedObserver = await this.observerRepository.editObserver(id, {
      name,
      email,
    })

    return right(updatedObserver)
  }
}
