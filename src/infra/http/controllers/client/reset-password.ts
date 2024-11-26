
import { ClientNonExistsError } from '@/domain/application/errors/ClientNonExists'
import { ResetClientPasswordService } from '@/domain/application/services/client/reset-password'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, HttpException, Patch } from '@nestjs/common'
import { z } from 'zod'

const sendResetPasswordDTO = z.object({
  password: z.string().min(8).max(140),
})

export type SendResetPasswordDTO = z.infer<typeof sendResetPasswordDTO>

const bodyValidation = new ZodValidationPipe(sendResetPasswordDTO)

@Controller('/client')
export class SendResetPasswordController {
  constructor(private resetClientPasswordService: ResetClientPasswordService) {}

  @Patch()
  async handle(
    @Body(bodyValidation) body: SendResetPasswordDTO,
    @CurrentUser() client: UserPayload,
  ) {
    const { password } = body

    const { sub } = client

    const editdClient = await this.resetClientPasswordService.execute({id: sub, password})

    if (editdClient.isLeft()) {
      const error = editdClient.value
      switch (error.constructor) {
        case ClientNonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 500)
      }
    }

    return {  }
  }
}
