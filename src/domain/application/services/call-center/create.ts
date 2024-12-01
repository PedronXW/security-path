import { Either, left, right } from '@/@shared/either'
import { CallCenter } from '@/domain/enterprise/entities/call-center'
import { Injectable } from '@nestjs/common'
import { CallCenterAlreadyExistsError } from '../../errors/CallCenterAlreadyExistsError'
import { CallCenterRepository } from '../../repositories/call-center-repository'

interface CreateCallCenterServiceRequest {
  name: string
  label: string
  description: string
}

type CreateCallCenterServiceResponse = Either<CallCenterAlreadyExistsError, CallCenter>

@Injectable()
export class CreateCallCenterService {
  constructor(
    private callcenterRepository: CallCenterRepository,
  ) {}

  async execute({
    name,
    label,
    description,
  }: CreateCallCenterServiceRequest): Promise<CreateCallCenterServiceResponse> {
    const callcenterExists = await this.callcenterRepository.getCallCenterByName(name)

    if (callcenterExists) {
      return left(new CallCenterAlreadyExistsError())
    }

    const callcenter = CallCenter.create({
      name,
      label,
      description,
    })

    const newCallCenter = await this.callcenterRepository.createCallCenter(callcenter)

    return right(newCallCenter)
  }
}
