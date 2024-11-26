
import { ClientNonExistsError } from '@/domain/application/errors/ClientNonExists'
import { EditClientService } from '@/domain/application/services/client/edit'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt-strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, HttpException, Patch } from '@nestjs/common'
import { z } from 'zod'
import { ClientPresenter } from '../../presenters/presenter-client'

const editClientDTO = z.object({
  name: z.string().min(2).max(140).optional(),
  email: z.string().email().max(140).optional(),
})

export type EditClientDTO = z.infer<typeof editClientDTO>

const bodyValidation = new ZodValidationPipe(editClientDTO)

@Controller('/client')
export class EditClientController {
  constructor(private editClientService: EditClientService) {}

  @Patch()
  async handle(
    @Body(bodyValidation) body: EditClientDTO,
    @CurrentUser() client: UserPayload,
  ) {
    const { name, email } = body

    const { sub } = client

    const editdClient = await this.editClientService.execute(sub, {name, email})

    if (editdClient.isLeft()) {
      const error = editdClient.value
      switch (error.constructor) {
        case ClientNonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 500)
      }
    }

    return { client: ClientPresenter.toHTTP(editdClient.value) }
  }
}
