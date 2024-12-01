import { InstallationNonExistsError } from '@/domain/application/errors/InstallationNonExists'
import { FindInstallationByIdService } from '@/domain/application/services/installation/find-by-id'
import { Controller, Get, HttpException, Param } from '@nestjs/common'
import { InstallationPresenter } from '../../presenters/presenter-installation'


@Controller('/installation')
export class FindInstallationByIdController {
  constructor(
    private readonly findInstallationByIdService: FindInstallationByIdService,
  ) {}

  @Get("/:id")
  async handle(@Param('id') id: string) {

    const receivedInstallation = await this.findInstallationByIdService.execute({
      id,
    })

    if (receivedInstallation.isLeft()) {
      const error = receivedInstallation.value
      switch (error.constructor) {
        case InstallationNonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 400)
      }
    }

    return { installation: InstallationPresenter.toHTTP(receivedInstallation.value) }
  }
}
