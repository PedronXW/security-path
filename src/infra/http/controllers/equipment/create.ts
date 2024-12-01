
import { CreateEquipmentService } from '@/domain/application/services/equipment/create'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, HttpException, Post } from '@nestjs/common'
import { z } from 'zod'
import { EquipmentPresenter } from '../../presenters/presenter-equipment'

const createEquipmentDTO = z.object({
  name: z.string().min(2).max(140),
  description: z.string().min(2).max(140),
  label: z.string().min(2).max(140),
  credential: z.string().min(2).max(140),
})

export type CreateEquipmentDTO = z.infer<typeof createEquipmentDTO>

const bodyValidation = new ZodValidationPipe(createEquipmentDTO)

@Public()
@Controller('/equipment')
export class CreateEquipmentController {
  constructor(private createEquipmentService: CreateEquipmentService) {}

  @Post()
  async handle(@Body(bodyValidation) body: CreateEquipmentDTO) {
    const { name, credential, description, label } = body

    const equipment = await this.createEquipmentService.execute({
      name,
      credential,
      description,
      label
    })

    if (equipment.isLeft()) {
      const error = equipment.value
      switch (error.constructor) {
        default:
          throw new HttpException('Error creating equipment', 400)
      }
    }

    return { equipment: EquipmentPresenter.toHTTP(equipment.value) }
  }
}
