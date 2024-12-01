
import { EquipmentNonExistsError } from '@/domain/application/errors/EquipmentNonExists'
import { EditEquipmentService } from '@/domain/application/services/equipment/edit'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, HttpException, Param, Patch } from '@nestjs/common'
import { z } from 'zod'
import { EquipmentPresenter } from '../../presenters/presenter-equipment'

const editEquipmentDTO = z.object({
  name: z.string().min(2).max(140).optional(),
  description: z.string().min(2).max(140),
  label: z.string().min(2).max(140),
  credential: z.string().min(2).max(140),
})

export type EditEquipmentDTO = z.infer<typeof editEquipmentDTO>

const bodyValidation = new ZodValidationPipe(editEquipmentDTO)

@Controller('/equipment')
export class EditEquipmentController {
  constructor(private editEquipmentService: EditEquipmentService) {}

  @Patch("/:id")
  async handle(
    @Body(bodyValidation) body: EditEquipmentDTO,
    @Param('id') equipment: string,
  ) {
    const { name, credential, description, label } = body


    const editdEquipment = await this.editEquipmentService.execute(equipment, {name, credential, description, label})

    if (editdEquipment.isLeft()) {
      const error = editdEquipment.value
      switch (error.constructor) {
        case EquipmentNonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 500)
      }
    }

    return { equipment: EquipmentPresenter.toHTTP(editdEquipment.value) }
  }
}
