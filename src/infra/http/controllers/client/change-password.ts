
import { ClientNonExistsError } from '@/domain/application/errors/ClientNonExists'
import { WrongCredentialError } from '@/domain/application/errors/WrongCredentialsError'
import { ChangePasswordService } from '@/domain/application/services/client/change-password'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, HttpException, Patch } from '@nestjs/common'

import { z } from 'zod'
import { ClientPresenter } from '../../presenters/presenter-client'

const changePasswordDTO = z.object({
  password: z.string().min(8),
  newPassword: z.string().min(8),
})

export type ChangePasswordDTO = z.infer<typeof changePasswordDTO>

const bodyValidation = new ZodValidationPipe(changePasswordDTO)

@Controller('/client/password')
export class ChangePasswordController {
  constructor(private readonly changePasswordService: ChangePasswordService) {}

  @Patch()
  async handle(
    @Body(bodyValidation) body: ChangePasswordDTO,
    @CurrentUser() client: UserPayload,
  ) {
    const { sub } = client

    const { password, newPassword } = body

    const editedClient = await this.changePasswordService.execute(
      sub,
      password,
      newPassword,
    )

    if (editedClient.isLeft()) {
      const error = editedClient.value
      switch (error.constructor) {
        case WrongCredentialError:
          throw new HttpException(error.message, 401)
        case ClientNonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 500)
      }
    }

    return { client: ClientPresenter.toHTTP(editedClient.value) }
  }
}
