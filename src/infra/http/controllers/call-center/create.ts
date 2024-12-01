
import { CreateCallCenterService } from '@/domain/application/services/call-center/create'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, HttpException, Post } from '@nestjs/common'
import { z } from 'zod'
import { CallCenterPresenter } from '../../presenters/presenter-call-center'

const createCallCenterDTO = z.object({
  name: z.string().min(2).max(140),
  description: z.string().min(2).max(140),
  label: z.string().min(2).max(140),
})

export type CreateCallCenterDTO = z.infer<typeof createCallCenterDTO>

const bodyValidation = new ZodValidationPipe(createCallCenterDTO)

@Public()
@Controller('/callcenter')
export class CreateCallCenterController {
  constructor(private createCallCenterService: CreateCallCenterService) {}

  @Post()
  async handle(@Body(bodyValidation) body: CreateCallCenterDTO) {
    const { name, description, label } = body

    const callcenter = await this.createCallCenterService.execute({
      name,
      description,
      label
    })

    if (callcenter.isLeft()) {
      const error = callcenter.value
      switch (error.constructor) {
        default:
          throw new HttpException('Error creating callcenter', 400)
      }
    }

    return { callcenter: CallCenterPresenter.toHTTP(callcenter.value) }
  }
}
