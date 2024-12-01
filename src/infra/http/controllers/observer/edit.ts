
import { ObserverNonExistsError } from '@/domain/application/errors/ObserverNonExists'
import { EditObserverService } from '@/domain/application/services/observer/edit'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, HttpException, Param, Patch } from '@nestjs/common'
import { z } from 'zod'
import { ObserverPresenter } from '../../presenters/presenter-observer'

const editObserverDTO = z.object({
  name: z.string().min(2).max(140).optional(),
  description: z.string().min(2).max(140).optional(),
  label: z.string().min(2).max(140).optional(),
})

export type EditObserverDTO = z.infer<typeof editObserverDTO>

const bodyValidation = new ZodValidationPipe(editObserverDTO)

@Controller('/observer')
export class EditObserverController {
  constructor(private editObserverService: EditObserverService) {}

  @Patch()
  async handle(
    @Body(bodyValidation) body: EditObserverDTO,
    @Param('id') id: string,
  ) {
    const { name, description, label } = body

    const editdObserver = await this.editObserverService.execute(id, {name, description, label})

    if (editdObserver.isLeft()) {
      const error = editdObserver.value
      switch (error.constructor) {
        case ObserverNonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 500)
      }
    }

    return { observer: ObserverPresenter.toHTTP(editdObserver.value) }
  }
}
