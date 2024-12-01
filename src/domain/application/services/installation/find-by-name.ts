import { Either, left, right } from '@/@shared/either'
import { Installation } from '@/domain/enterprise/entities/installation'
import { Injectable } from '@nestjs/common'
import { InstallationNonExistsError } from '../../errors/InstallationNonExists'
import { InstallationRepository } from '../../repositories/installation-repository'

type FindInstallationByNameServiceRequest = {
  name: string
}

type FindInstallationByNameServiceResponse = Either<InstallationNonExistsError, Installation>

@Injectable()
export class FindInstallationByNameService {
  constructor(private installationRepository: InstallationRepository) {}

  async execute({
    name,
  }: FindInstallationByNameServiceRequest): Promise<FindInstallationByNameServiceResponse> {
    const installation = await this.installationRepository.getInstallationByName(name)

    if (!installation) {
      return left(new InstallationNonExistsError())
    }

    return right(installation)
  }
}
