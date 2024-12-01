import { CallCenterNonExistsError } from '@/domain/application/errors/CallCenterNonExists'
import { FetchAllCallCentersService } from '@/domain/application/services/call-center/fetch-all'
import { Body, Controller, Get, HttpException } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { CallCenterPresenter } from '../../presenters/presenter-call-center'


const fetchAllCallCentersDTO = z.object({
  limit: z.number().int().positive().optional(),
  page: z.number().int().positive().optional(),
})

export type FetchAllCallCentersDTO = z.infer<typeof fetchAllCallCentersDTO>

const bodyValidation = new ZodValidationPipe(fetchAllCallCentersDTO)


@Controller('/callcenter')
export class FetchAllCallCentersController {
  constructor(
    private readonly fetchAllCallCentersService: FetchAllCallCentersService,
  ) {}

  @Get()
  async handle(@Body(bodyValidation) body: FetchAllCallCentersDTO) {
    const { page, limit } = body

    const receivedCallCenter = await this.fetchAllCallCentersService.execute(page, limit)

    if (receivedCallCenter.isLeft()) {
      const error = receivedCallCenter.value
      switch (error.constructor) {
        case CallCenterNonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 400)
      }
    }

    return { callcenter: receivedCallCenter.value.map(CallCenterPresenter.toHTTP) }
  }
}
