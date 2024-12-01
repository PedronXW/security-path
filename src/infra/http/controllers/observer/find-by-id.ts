import { ObserverNonExistsError } from '@/domain/application/errors/ObserverNonExists'
import { FindObserverByIdService } from '@/domain/application/services/observer/find-by-id'
import { Controller, Get, HttpException, Param } from '@nestjs/common'
import { ObserverPresenter } from '../../presenters/presenter-observer'


@Controller('/observer')
export class FindObserverByIdController {
  constructor(
    private readonly findObserverByIdService: FindObserverByIdService,
  ) {}

  @Get()
  async handle(@Param('id') id: string) {

    const receivedObserver = await this.findObserverByIdService.execute({
      id,
    })

    if (receivedObserver.isLeft()) {
      const error = receivedObserver.value
      switch (error.constructor) {
        case ObserverNonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 400)
      }
    }

    return { observer: ObserverPresenter.toHTTP(receivedObserver.value) }
  }
}
