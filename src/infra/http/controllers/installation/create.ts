
import { CreateInstallationService } from '@/domain/application/services/installation/create'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, HttpException, Post } from '@nestjs/common'
import { z } from 'zod'
import { InstallationPresenter } from '../../presenters/presenter-installation'

const createInstallationDTO = z.object({
  name: z.string().min(2).max(140),
  description: z.string().min(2).max(140),
  label: z.string().min(2).max(140),
})

export type CreateInstallationDTO = z.infer<typeof createInstallationDTO>

const bodyValidation = new ZodValidationPipe(createInstallationDTO)

@Public()
@Controller('/installation')
export class CreateInstallationController {
  constructor(private createInstallationService: CreateInstallationService) {}

  @Post()
  async handle(@Body(bodyValidation) body: CreateInstallationDTO) {
    const { name, description, label } = body

    const installation = await this.createInstallationService.execute({
      name,
      description,
      label
    })

    if (installation.isLeft()) {
      const error = installation.value
      switch (error.constructor) {
        default:
          throw new HttpException('Error creating installation', 400)
      }
    }

    return { installation: InstallationPresenter.toHTTP(installation.value) }
  }
}
