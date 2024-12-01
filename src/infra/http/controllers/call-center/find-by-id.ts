import { CallCenterNonExistsError } from '@/domain/application/errors/CallCenterNonExists'
import { FindCallCenterByIdService } from '@/domain/application/services/call-center/find-by-id'
import { Controller, Get, HttpException, Param } from '@nestjs/common'
import { CallCenterPresenter } from '../../presenters/presenter-call-center'

@Controller('/callcenter')
export class FindCallCenterByIdController {
  constructor(
    private readonly findCallCenterByIdService: FindCallCenterByIdService,
  ) {}

  @Get("/:id")
  async handle(@Param('id') id: string) {

    const receivedCallCenter = await this.findCallCenterByIdService.execute({
      id,
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
