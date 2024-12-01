
import { CreateObserverService } from '@/domain/application/services/observer/create'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, HttpException, Post } from '@nestjs/common'
import { z } from 'zod'
import { ObserverPresenter } from '../../presenters/presenter-observer'

const createObserverDTO = z.object({
  name: z.string().min(2).max(140),
  description: z.string().min(2).max(140),
  label: z.string().min(2).max(140),
  password: z.string().min(8),
})

export type CreateObserverDTO = z.infer<typeof createObserverDTO>

const bodyValidation = new ZodValidationPipe(createObserverDTO)

@Public()
@Controller('/observer')
export class CreateObserverController {
  constructor(private createObserverService: CreateObserverService) {}

  @Post()
  async handle(@Body(bodyValidation) body: CreateObserverDTO) {
    const { name, description, label, password } = body

    const observer = await this.createObserverService.execute({
      name,
      description,
      label,
      password,
    })

    if (observer.isLeft()) {
      const error = observer.value
      switch (error.constructor) {
        default:
          throw new HttpException('Error creating observer', 400)
      }
    }

    return { observer: ObserverPresenter.toHTTP(observer.value) }
  }
}
