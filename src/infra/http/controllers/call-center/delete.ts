
import { CallCenterNonExistsError } from '@/domain/application/errors/CallCenterNonExists'
import { DeleteCallCenterService } from '@/domain/application/services/call-center/delete'
import { Controller, Delete, HttpCode, HttpException, Param } from '@nestjs/common'


@Controller('/callcenter')
export class DeleteCallCenterController {
  constructor(private deleteCallCenterService: DeleteCallCenterService) {}

  @Delete("/:id")
  @HttpCode(204)
  async handle(@Param('id') id: string) {

    const result = await this.deleteCallCenterService.execute({
      id,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case CallCenterNonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 400)
      }
    }

    return { message: 'CallCenter deleted' }
  }
}
