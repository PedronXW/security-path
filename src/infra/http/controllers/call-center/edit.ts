
import { CallCenterNonExistsError } from '@/domain/application/errors/CallCenterNonExists'
import { EditCallCenterService } from '@/domain/application/services/call-center/edit'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, HttpException, Param, Patch } from '@nestjs/common'
import { z } from 'zod'
import { CallCenterPresenter } from '../../presenters/presenter-call-center'

const editCallCenterDTO = z.object({
  name: z.string().min(2).max(140).optional(),
  description: z.string().min(2).max(140).optional(),
  label: z.string().min(2).max(140).optional(),
})

export type EditCallCenterDTO = z.infer<typeof editCallCenterDTO>

const bodyValidation = new ZodValidationPipe(editCallCenterDTO)

@Controller('/callcenter')
export class EditCallCenterController {
  constructor(private editCallCenterService: EditCallCenterService) {}

  @Patch("/:id")
  async handle(
    @Body(bodyValidation) body: EditCallCenterDTO,
    @Param('id') callcenter: string,
  ) {
    const { name, description, label } = body

    const editdCallCenter = await this.editCallCenterService.execute(callcenter, {name, description, label})

    if (editdCallCenter.isLeft()) {
      const error = editdCallCenter.value
      switch (error.constructor) {
        case CallCenterNonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 500)
      }
    }

    return { callcenter: CallCenterPresenter.toHTTP(editdCallCenter.value) }
  }
}
