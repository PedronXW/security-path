import { Either, left, right } from '@/@shared/either'
import { Installation } from '@/domain/enterprise/entities/installation'
import { Injectable } from '@nestjs/common'
import { InstallationNonExistsError } from '../../errors/InstallationNonExists'
import { InstallationRepository } from '../../repositories/installation-repository'

type FindInstallationByIdServiceRequest = {
  id: string
}

type FindInstallationByIdServiceResponse = Either<InstallationNonExistsError, Installation>

@Injectable()
export class FindInstallationByIdService {
  constructor(private installationRepository: InstallationRepository) {}

  async execute({
    id,
  }: FindInstallationByIdServiceRequest): Promise<FindInstallationByIdServiceResponse> {
    const installation = await this.installationRepository.getInstallationById(id)

    if (!installation) {
      return left(new InstallationNonExistsError())
    }

    return right(installation)
  }
}
