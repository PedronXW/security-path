import { ClientNonExistsError } from '@/domain/application/errors/ClientNonExists'
import { SendVerificationClientEmailService } from '@/domain/application/services/client/send-verification-email'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { Controller, Get, HttpException } from '@nestjs/common'


@Controller('/client')
export class SendVerificationClientEmailController {
  constructor(
    private readonly sendVerificationEmailService: SendVerificationClientEmailService,
  ) {}

  @Get()
  async handle(@CurrentUser() client: UserPayload) {
    const { sub } = client

    const receivedClient = await this.sendVerificationEmailService.execute({
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

    return {}
  }
}
