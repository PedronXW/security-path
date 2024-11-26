import { ClientNonExistsError } from '@/domain/application/errors/ClientNonExists'
import { FetchClientByEmailService } from '@/domain/application/services/client/fetch-by-email'
import { Body, Controller, Get, HttpException } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ClientPresenter } from '../../presenters/presenter-client'

export const fetchByEmailDTO = z.object({
  email: z.string().email(),
})

export type FetchByEmailDTO = z.infer<typeof fetchByEmailDTO>

const bodyValidation = new ZodValidationPipe(fetchByEmailDTO)

@Controller('/client')
export class FindClientByIdController {
  constructor(
    private readonly fetchClientByEmailService: FetchClientByEmailService,
  ) {}

  @Get()
  async handle(@Body(bodyValidation) body: FetchByEmailDTO) {
    const { email } = body

    const receivedClient = await this.fetchClientByEmailService.execute({
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
