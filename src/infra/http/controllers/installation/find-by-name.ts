import { InstallationNonExistsError } from '@/domain/application/errors/InstallationNonExists'
import { FindInstallationByNameService } from '@/domain/application/services/installation/find-by-name'
import { Body, Controller, Get, HttpException } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { InstallationPresenter } from '../../presenters/presenter-installation'

export const findByNameDTO = z.object({
  name: z.string().min(2).max(140),
})

export type FindByNameDTO = z.infer<typeof findByNameDTO>

const bodyValidation = new ZodValidationPipe(findByNameDTO)

@Controller('/installation')
export class FindInstallationByNameController {
  constructor(
    private readonly findInstallationByNameService: FindInstallationByNameService,
  ) {}

  @Get()
  async handle(@Body(bodyValidation) body: FindByNameDTO) {
    const { name } = body

    const receivedInstallation = await this.findInstallationByNameService.execute({
      name
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
