
import { InstallationNonExistsError } from '@/domain/application/errors/InstallationNonExists'
import { DeleteInstallationService } from '@/domain/application/services/installation/delete'
import { Controller, Delete, HttpCode, HttpException, Param } from '@nestjs/common'


@Controller('/installation')
export class DeleteInstallationController {
  constructor(private deleteInstallationService: DeleteInstallationService) {}

  @Delete("/:id")
  @HttpCode(204)
  async handle(@Param('id') id: string) {

    const result = await this.deleteInstallationService.execute({
      id,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case InstallationNonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 400)
      }
    }

    return { message: 'Installation deleted' }
  }
}
