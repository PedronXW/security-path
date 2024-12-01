import { ObserverNonExistsError } from '@/domain/application/errors/ObserverNonExists'
import { FetchAllObserversService } from '@/domain/application/services/observer/fetch-all'
import { Body, Controller, Get, HttpException } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ObserverPresenter } from '../../presenters/presenter-observer'


const fetchAllObserversDTO = z.object({
  limit: z.number().int().positive().optional(),
  page: z.number().int().positive().optional(),
})

export type FetchAllObserversDTO = z.infer<typeof fetchAllObserversDTO>

const bodyValidation = new ZodValidationPipe(fetchAllObserversDTO)


@Controller('/observer')
export class FetchAllObserversController {
  constructor(
    private readonly fetchAllObserversService: FetchAllObserversService,
  ) {}

  @Get()
  async handle(@Body(bodyValidation) body: FetchAllObserversDTO) {
    const { page, limit } = body

    const receivedObserver = await this.fetchAllObserversService.execute(page, limit)

    if (receivedObserver.isLeft()) {
      const error = receivedObserver.value
      switch (error.constructor) {
        case ObserverNonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 400)
      }
    }

    return { observer: receivedObserver.value.map(ObserverPresenter.toHTTP) }
  }
}
