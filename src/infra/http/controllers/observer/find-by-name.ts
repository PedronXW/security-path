import { ObserverNonExistsError } from '@/domain/application/errors/ObserverNonExists'
import { FindObserverByNameService } from '@/domain/application/services/observer/find-by-name'
import { Body, Controller, Get, HttpException } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ObserverPresenter } from '../../presenters/presenter-observer'

export const findByNameDTO = z.object({
  name: z.string().min(2).max(140),
})

export type FindByNameDTO = z.infer<typeof findByNameDTO>

const bodyValidation = new ZodValidationPipe(findByNameDTO)

@Controller('/observer')
export class FindObserverByNameController {
  constructor(
    private readonly findObserverByNameService: FindObserverByNameService,
  ) {}

  @Get()
  async handle(@Body(bodyValidation) body: FindByNameDTO) {
    const { name } = body

    const receivedObserver = await this.findObserverByNameService.execute({
      name
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
