import { ClientNonExistsError } from '@/domain/application/errors/ClientNonExists'
import { FetchAllClientsService } from '@/domain/application/services/client/fetch-all'
import { Body, Controller, Get, HttpException } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { ClientPresenter } from '../../presenters/presenter-client'


const fetchAllClientsDTO = z.object({
  limit: z.number().int().positive().optional(),
  page: z.number().int().positive().optional(),
})

export type FetchAllClientsDTO = z.infer<typeof fetchAllClientsDTO>

const bodyValidation = new ZodValidationPipe(fetchAllClientsDTO)


@Controller('/client')
export class FetchAllClientsController {
  constructor(
    private readonly fetchAllClientsService: FetchAllClientsService,
  ) {}

  @Get()
  async handle(@Body(bodyValidation) body: FetchAllClientsDTO) {
    const { page, limit } = body

    const receivedClient = await this.fetchAllClientsService.execute(page, limit)

    if (receivedClient.isLeft()) {
      const error = receivedClient.value
      switch (error.constructor) {
        case ClientNonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 400)
      }
    }

    return { client: receivedClient.value.map(ClientPresenter.toHTTP) }
  }
}
