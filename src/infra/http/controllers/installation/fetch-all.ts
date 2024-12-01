import { InstallationNonExistsError } from '@/domain/application/errors/InstallationNonExists'
import { FetchAllInstallationsService } from '@/domain/application/services/installation/fetch-all'
import { Body, Controller, Get, HttpException } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { InstallationPresenter } from '../../presenters/presenter-installation'


const fetchAllInstallationsDTO = z.object({
  limit: z.number().int().positive().optional(),
  page: z.number().int().positive().optional(),
})

export type FetchAllInstallationsDTO = z.infer<typeof fetchAllInstallationsDTO>

const bodyValidation = new ZodValidationPipe(fetchAllInstallationsDTO)


@Controller('/installation')
export class FetchAllInstallationsController {
  constructor(
    private readonly fetchAllInstallationsService: FetchAllInstallationsService,
  ) {}

  @Get()
  async handle(@Body(bodyValidation) body: FetchAllInstallationsDTO) {
    const { page, limit } = body

    const receivedInstallation = await this.fetchAllInstallationsService.execute(page, limit)

    if (receivedInstallation.isLeft()) {
      const error = receivedInstallation.value
      switch (error.constructor) {
        case InstallationNonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 400)
      }
    }

    return { installation: receivedInstallation.value.map(InstallationPresenter.toHTTP) }
  }
}
