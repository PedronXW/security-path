import { Either, left, right } from '@/@shared/either'
import { Installation } from '@/domain/enterprise/entities/installation'
import { Injectable } from '@nestjs/common'
import { InstallationNonExistsError } from '../../errors/InstallationNonExists'
import { InstallationRepository } from '../../repositories/installation-repository'

type FetchInstallationByIdServiceRequest = {
  id: string
}

type FetchInstallationByIdServiceResponse = Either<InstallationNonExistsError, Installation>

@Injectable()
export class FetchInstallationByIdService {
  constructor(private installationRepository: InstallationRepository) {}

  async execute({
    id,
  }: FetchInstallationByIdServiceRequest): Promise<FetchInstallationByIdServiceResponse> {
    const installation = await this.installationRepository.getInstallationById(id)

    if (!installation) {
      return left(new InstallationNonExistsError())
    }

    return right(installation)
  }
}
