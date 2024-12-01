
import { ObserverNonExistsError } from '@/domain/application/errors/ObserverNonExists'
import { DeleteObserverService } from '@/domain/application/services/observer/delete'
import { Controller, Delete, HttpCode, HttpException, Param } from '@nestjs/common'


@Controller('/observer')
export class DeleteObserverController {
  constructor(private deleteObserverService: DeleteObserverService) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') id: string) {

    const result = await this.deleteObserverService.execute({
      id,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ObserverNonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 400)
      }
    }

    return { message: 'Observer deleted' }
  }
}
