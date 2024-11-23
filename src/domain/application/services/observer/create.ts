import { Either, left, right } from '@/@shared/either'
import { Observer } from '@/domain/enterprise/entities/observer'
import { Injectable } from '@nestjs/common'
import { HashGenerator } from '../../criptography/hash-generator'
import { ObserverAlreadyExistsError } from '../../errors/ObserverAlreadyExistsError'
import { ObserverRepository } from '../../repositories/observer-repository'

interface CreateObserverServiceRequest {
  name: string
  label: string
  description: string
  password: string
}

type CreateObserverServiceResponse = Either<ObserverAlreadyExistsError, Observer>

@Injectable()
export class CreateObserverService {
  constructor(
    private observerRepository: ObserverRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    label,
    description,
    password,
  }: CreateObserverServiceRequest): Promise<CreateObserverServiceResponse> {
    const observerExists = await this.observerRepository.getObserverByName(name)

    if (observerExists) {
      return left(new ObserverAlreadyExistsError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const observer = Observer.create({
      name,
      label,
      description,
      password: hashedPassword,
    })

    const newObserver = await this.observerRepository.createObserver(observer)

    return right(newObserver)
  }
}
