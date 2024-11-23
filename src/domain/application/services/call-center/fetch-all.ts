import { Either, left, right } from '@/@shared/either'
import { CallCenter } from '@/domain/enterprise/entities/call-center'
import { Injectable } from '@nestjs/common'
import { CallCenterNonExistsError } from '../../errors/CallCenterNonExists'
import { CallCenterRepository } from '../../repositories/call-center-repository'

type FetchAllCallCentersServiceResponse = Either<CallCenterNonExistsError, CallCenter[]>

@Injectable()
export class FetchAllCallCentersService {
  constructor(private callcenterRepository: CallCenterRepository) {}

  async execute(
    page: number,
    limit: number,
  ): Promise<FetchAllCallCentersServiceResponse> {
    const callcenter = await this.callcenterRepository.getAllCallCenters(page, limit)

    if (!callcenter) {
      return left(new CallCenterNonExistsError())
    }

    return right(callcenter)
  }
}
