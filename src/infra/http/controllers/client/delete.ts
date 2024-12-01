
import { ClientNonExistsError } from '@/domain/application/errors/ClientNonExists'
import { InactiveClientError } from '@/domain/application/errors/InactiveClientError'
import { DeleteClientService } from '@/domain/application/services/client/delete'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { Controller, Delete, HttpCode, HttpException } from '@nestjs/common'


@Controller('/client')
export class DeleteClientController {
  constructor(private deleteClientService: DeleteClientService) {}

  @Delete()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload) {
    const { sub } = user

    const result = await this.deleteClientService.execute({
      id: sub,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case ClientNonExistsError:
          throw new HttpException(error.message, 403)
        case InactiveClientError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 400)
      }
    }

    return { message: 'Client deleted' }
  }
}
