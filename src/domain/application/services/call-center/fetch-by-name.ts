import { Either, left, right } from '@/@shared/either'
import { CallCenter } from '@/domain/enterprise/entities/call-center'
import { Injectable } from '@nestjs/common'
import { CallCenterNonExistsError } from '../../errors/CallCenterNonExists'
import { CallCenterRepository } from '../../repositories/call-center-repository'

type FetchCallCenterByEmailServiceRequest = {
  name: string
}

type FetchCallCenterByEmailServiceResponse = Either<CallCenterNonExistsError, CallCenter>

@Injectable()
export class FetchCallCenterByEmailService {
  constructor(private callcenterRepository: CallCenterRepository) {}

  async execute({
    name,
  }: FetchCallCenterByEmailServiceRequest): Promise<FetchCallCenterByEmailServiceResponse> {
    const callcenter = await this.callcenterRepository.getCallCenterByName(name)

    if (!callcenter) {
      return left(new CallCenterNonExistsError())
    }

    return right(callcenter)
  }
}
