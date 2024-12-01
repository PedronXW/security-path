
import { InstallationNonExistsError } from '@/domain/application/errors/InstallationNonExists'
import { EditInstallationService } from '@/domain/application/services/installation/edit'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, HttpException, Param, Patch } from '@nestjs/common'
import { z } from 'zod'
import { InstallationPresenter } from '../../presenters/presenter-installation'

const editInstallationDTO = z.object({
  name: z.string().min(2).max(140).optional(),
  description: z.string().min(2).max(140),
  label: z.string().min(2).max(140),
})

export type EditInstallationDTO = z.infer<typeof editInstallationDTO>

const bodyValidation = new ZodValidationPipe(editInstallationDTO)

@Controller('/installation')
export class EditInstallationController {
  constructor(private editInstallationService: EditInstallationService) {}

  @Patch("/:id")
  async handle(
    @Body(bodyValidation) body: EditInstallationDTO,
    @Param('id') installation: string,
  ) {
    const { name, description, label } = body


    const editdInstallation = await this.editInstallationService.execute(installation, {name, description, label})

    if (editdInstallation.isLeft()) {
      const error = editdInstallation.value
      switch (error.constructor) {
        case InstallationNonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 500)
      }
    }

    return { installation: InstallationPresenter.toHTTP(editdInstallation.value) }
  }
}
