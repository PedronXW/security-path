import { Either, left, right } from '@/@shared/either'
import { Installation } from '@/domain/enterprise/entities/installation'
import { Injectable } from '@nestjs/common'
import { InstallationNonExistsError } from '../../errors/InstallationNonExists'
import { InstallationRepository } from '../../repositories/installation-repository'

type FetchAllInstallationsServiceResponse = Either<InstallationNonExistsError, Installation[]>

@Injectable()
export class FetchAllInstallationsService {
  constructor(private installationRepository: InstallationRepository) {}

  async execute(
    page: number,
    limit: number,
  ): Promise<FetchAllInstallationsServiceResponse> {
    const installation = await this.installationRepository.getAllInstallations(page, limit)

    if (!installation) {
      return left(new InstallationNonExistsError())
    }

    return right(installation)
  }
}
