
import { ClientNonExistsError } from '@/domain/application/errors/ClientNonExists'
import { SendResetPasswordService } from '@/domain/application/services/client/send-reset-password'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, HttpException, Patch } from '@nestjs/common'
import { z } from 'zod'

const sendResetPasswordDTO = z.object({
  email: z.string().email().max(140).optional(),
})

export type SendResetPasswordDTO = z.infer<typeof sendResetPasswordDTO>

const bodyValidation = new ZodValidationPipe(sendResetPasswordDTO)

@Controller('/client')
export class SendResetPasswordController {
  constructor(private sendResetPasswordService: SendResetPasswordService) {}

  @Patch()
  async handle(
    @Body(bodyValidation) body: SendResetPasswordDTO,
  ) {
    const { email } = body

    const editdClient = await this.sendResetPasswordService.execute({email})

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
