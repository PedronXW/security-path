import { Either, left, right } from '@/@shared/either'
import { CallCenter } from '@/domain/enterprise/entities/call-center'
import { Injectable } from '@nestjs/common'
import { CallCenterNonExistsError } from '../../errors/CallCenterNonExists'
import { CallCenterRepository } from '../../repositories/call-center-repository'

type FindCallCenterByIdServiceRequest = {
  id: string
}

type FindCallCenterByIdServiceResponse = Either<CallCenterNonExistsError, CallCenter>

@Injectable()
export class FindCallCenterByIdService {
  constructor(private callcenterRepository: CallCenterRepository) {}

  async execute({
    id,
  }: FindCallCenterByIdServiceRequest): Promise<FindCallCenterByIdServiceResponse> {
    const callcenter = await this.callcenterRepository.getCallCenterById(id)

    if (!callcenter) {
      return left(new CallCenterNonExistsError())
    }

    return right(callcenter)
  }
}
