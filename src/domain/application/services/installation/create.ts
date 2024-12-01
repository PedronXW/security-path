import { Either, left, right } from '@/@shared/either'
import { Installation } from '@/domain/enterprise/entities/installation'
import { Injectable } from '@nestjs/common'
import { InstallationAlreadyExistsError } from '../../errors/InstallationAlreadyExistsError'
import { InstallationRepository } from '../../repositories/installation-repository'

interface CreateInstallationServiceRequest {
  name: string
  label: string
  description: string
}

type CreateInstallationServiceResponse = Either<InstallationAlreadyExistsError, Installation>

@Injectable()
export class CreateInstallationService {
  constructor(
    private installationRepository: InstallationRepository,
  ) {}

  async execute({
    name,
    label,
    description,
  }: CreateInstallationServiceRequest): Promise<CreateInstallationServiceResponse> {
    const installationExists = await this.installationRepository.getInstallationByName(name)

    if (installationExists) {
      return left(new InstallationAlreadyExistsError())
    }

    const installation = Installation.create({
      name,
      label,
      description,
    })

    const newInstallation = await this.installationRepository.createInstallation(installation)

    return right(newInstallation)
  }
}
