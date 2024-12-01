import { CallCenterNonExistsError } from '@/domain/application/errors/CallCenterNonExists'
import { FindCallCenterByNameService } from '@/domain/application/services/call-center/find-by-name'
import { Body, Controller, Get, HttpException } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CallCenterPresenter } from '../../presenters/presenter-call-center'

export const findByNameDTO = z.object({
  name: z.string().min(2).max(140),
})

export type FindByNameDTO = z.infer<typeof findByNameDTO>

const bodyValidation = new ZodValidationPipe(findByNameDTO)

@Controller('/callcenter')
export class FindCallCenterByNameController {
  constructor(
    private readonly findCallCenterByNameService: FindCallCenterByNameService,
  ) {}

  @Get()
  async handle(@Body(bodyValidation) body: FindByNameDTO) {
    const { name } = body

    const receivedCallCenter = await this.findCallCenterByNameService.execute({
      name
    })

    if (receivedCallCenter.isLeft()) {
      const error = receivedCallCenter.value
      switch (error.constructor) {
        case CallCenterNonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 400)
      }
    }

    return { callcenter: CallCenterPresenter.toHTTP(receivedCallCenter.value) }
  }
}
