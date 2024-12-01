import { ClientNonExistsError } from '@/domain/application/errors/ClientNonExists'
import { FindClientByEmailService } from '@/domain/application/services/client/find-by-email'
import { Body, Controller, Get, HttpException } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ClientPresenter } from '../../presenters/presenter-client'

export const findByEmailDTO = z.object({
  email: z.string().email(),
})

export type FindByEmailDTO = z.infer<typeof findByEmailDTO>

const bodyValidation = new ZodValidationPipe(findByEmailDTO)

@Controller('/client')
export class FindClientByEmailController {
  constructor(
    private readonly findClientByEmailService: FindClientByEmailService,
  ) {}

  @Get()
  async handle(@Body(bodyValidation) body: FindByEmailDTO) {
    const { email } = body

    const receivedClient = await this.findClientByEmailService.execute({
      email
    })

    if (receivedClient.isLeft()) {
      const error = receivedClient.value
      switch (error.constructor) {
        case ClientNonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 400)
      }
    }

    return { client: ClientPresenter.toHTTP(receivedClient.value) }
  }
}
