
import { ObserverNonExistsError } from '@/domain/application/errors/ObserverNonExists'
import { WrongCredentialError } from '@/domain/application/errors/WrongCredentialsError'
import { ChangeObserverPasswordService } from '@/domain/application/services/observer/change-password'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, HttpException, Patch } from '@nestjs/common'

import { z } from 'zod'
import { ObserverPresenter } from '../../presenters/presenter-observer'

const changePasswordDTO = z.object({
  password: z.string().min(8),
  newPassword: z.string().min(8),
})

export type ChangePasswordDTO = z.infer<typeof changePasswordDTO>

const bodyValidation = new ZodValidationPipe(changePasswordDTO)

@Controller('/observer/password')
export class ChangeObserverPasswordController {
  constructor(private readonly changePasswordService: ChangeObserverPasswordService) {}

  @Patch()
  async handle(
    @Body(bodyValidation) body: ChangePasswordDTO,
    @CurrentUser() observer: UserPayload,
  ) {
    const { sub } = observer

    const { password, newPassword } = body

    const editedObserver = await this.changePasswordService.execute(
      sub,
      password,
      newPassword,
    )

    if (editedObserver.isLeft()) {
      const error = editedObserver.value
      switch (error.constructor) {
        case WrongCredentialError:
          throw new HttpException(error.message, 401)
        case ObserverNonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 500)
      }
    }

    return { observer: ObserverPresenter.toHTTP(editedObserver.value) }
  }
}
