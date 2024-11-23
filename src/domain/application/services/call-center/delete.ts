import { Either, left, right } from '@/@shared/either'
import { Injectable } from '@nestjs/common'
import { CallCenterNonExistsError } from '../../errors/CallCenterNonExists'
import { CallCenterRepository } from '../../repositories/call-center-repository'

type DeleteCallCenterServiceRequest = {
  id: string
}

type DeleteCallCenterServiceResponse = Either<CallCenterNonExistsError, boolean>

@Injectable()
export class DeleteCallCenterService {
  constructor(private callcenterRepository: CallCenterRepository) {}

  async execute({
    id,
  }: DeleteCallCenterServiceRequest): Promise<DeleteCallCenterServiceResponse> {
    const callcenter = await this.callcenterRepository.getCallCenterById(id)

    if (!callcenter) {
      return left(new CallCenterNonExistsError())
    }

    const result = await this.callcenterRepository.deleteCallCenter(id)

    return right(result)
  }
}
