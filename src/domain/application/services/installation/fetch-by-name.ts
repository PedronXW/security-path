import { Either, left, right } from '@/@shared/either'
import { Installation } from '@/domain/enterprise/entities/installation'
import { Injectable } from '@nestjs/common'
import { InstallationNonExistsError } from '../../errors/InstallationNonExists'
import { InstallationRepository } from '../../repositories/installation-repository'

type FetchInstallationByEmailServiceRequest = {
  name: string
}

type FetchInstallationByEmailServiceResponse = Either<InstallationNonExistsError, Installation>

@Injectable()
export class FetchInstallationByEmailService {
  constructor(private installationRepository: InstallationRepository) {}

  async execute({
    name,
  }: FetchInstallationByEmailServiceRequest): Promise<FetchInstallationByEmailServiceResponse> {
    const installation = await this.installationRepository.getInstallationByName(name)

    if (!installation) {
      return left(new InstallationNonExistsError())
    }

    return right(installation)
  }
}
