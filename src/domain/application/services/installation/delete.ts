import { Either, left, right } from '@/@shared/either'
import { Injectable } from '@nestjs/common'
import { InstallationNonExistsError } from '../../errors/InstallationNonExists'
import { InstallationRepository } from '../../repositories/installation-repository'

type DeleteInstallationServiceRequest = {
  id: string
}

type DeleteInstallationServiceResponse = Either<InstallationNonExistsError, boolean>

@Injectable()
export class DeleteInstallationService {
  constructor(private installationRepository: InstallationRepository) {}

  async execute({
    id,
  }: DeleteInstallationServiceRequest): Promise<DeleteInstallationServiceResponse> {
    const installation = await this.installationRepository.getInstallationById(id)

    if (!installation) {
      return left(new InstallationNonExistsError())
    }

    const result = await this.installationRepository.deleteInstallation(id)

    return right(result)
  }
}
