import { Either, left, right } from '@/@shared/either'
import { Installation } from '@/domain/enterprise/entities/installation'
import { Injectable } from '@nestjs/common'
import { InstallationNonExistsError } from '../../errors/InstallationNonExists'
import { InstallationRepository } from '../../repositories/installation-repository'

type EditInstallationServiceRequest = {
  name?: string
  email?: string
}

type EditInstallationServiceResponse = Either<InstallationNonExistsError, Installation>

@Injectable()
export class EditInstallationService {
  constructor(private installationRepository: InstallationRepository) {}

  async execute(
    id: string,
    { name, email }: EditInstallationServiceRequest,
  ): Promise<EditInstallationServiceResponse> {
    const installation = await this.installationRepository.getInstallationById(id)

    if (!installation) {
      return left(new InstallationNonExistsError())
    }

    const updatedInstallation = await this.installationRepository.editInstallation(id, {
      name,
      email,
    })

    return right(updatedInstallation)
  }
}
