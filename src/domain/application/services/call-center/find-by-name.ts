import { Either, left, right } from '@/@shared/either'
import { CallCenter } from '@/domain/enterprise/entities/call-center'
import { Injectable } from '@nestjs/common'
import { CallCenterNonExistsError } from '../../errors/CallCenterNonExists'
import { CallCenterRepository } from '../../repositories/call-center-repository'

type FindCallCenterByNameServiceRequest = {
  name: string
}

type FindCallCenterByNameServiceResponse = Either<CallCenterNonExistsError, CallCenter>

@Injectable()
export class FindCallCenterByNameService {
  constructor(private callcenterRepository: CallCenterRepository) {}

  async execute({
    name,
  }: FindCallCenterByNameServiceRequest): Promise<FindCallCenterByNameServiceResponse> {
    const callcenter = await this.callcenterRepository.getCallCenterByName(name)

    if (!callcenter) {
      return left(new CallCenterNonExistsError())
    }

    return right(callcenter)
  }
}
