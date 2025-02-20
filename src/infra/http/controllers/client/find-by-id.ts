import { ClientNonExistsError } from '@/domain/application/errors/ClientNonExists'
import { FindClientByIdService } from '@/domain/application/services/client/find-by-id'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { Controller, Get, HttpException } from '@nestjs/common'
import { ClientPresenter } from '../../presenters/presenter-client'


@Controller('/client')
export class FindClientByIdController {
  constructor(
    private readonly findClientByIdService: FindClientByIdService,
  ) {}

  @Get()
  async handle(@CurrentUser() client: UserPayload) {
    const { sub } = client

    const receivedClient = await this.findClientByIdService.execute({
      id: sub,
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
