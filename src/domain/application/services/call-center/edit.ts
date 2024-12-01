import { Either, left, right } from '@/@shared/either'
import { CallCenter } from '@/domain/enterprise/entities/call-center'
import { Injectable } from '@nestjs/common'
import { CallCenterNonExistsError } from '../../errors/CallCenterNonExists'
import { CallCenterRepository } from '../../repositories/call-center-repository'

type EditCallCenterServiceRequest = {
  name?: string
  description?: string
  label?: string
}

type EditCallCenterServiceResponse = Either<CallCenterNonExistsError, CallCenter>

@Injectable()
export class EditCallCenterService {
  constructor(private callcenterRepository: CallCenterRepository) {}

  async execute(
    id: string,
    { name, description, label }: EditCallCenterServiceRequest,
  ): Promise<EditCallCenterServiceResponse> {
    const callcenter = await this.callcenterRepository.getCallCenterById(id)

    if (!callcenter) {
      return left(new CallCenterNonExistsError())
    }

    const updatedCallCenter = await this.callcenterRepository.editCallCenter(id, callcenter)

    return right(updatedCallCenter)
  }
}
