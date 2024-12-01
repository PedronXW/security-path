import { EquipmentNonExistsError } from '@/domain/application/errors/EquipmentNonExists'
import { FindEquipmentByNameService } from '@/domain/application/services/equipment/find-by-name'
import { Body, Controller, Get, HttpException } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { EquipmentPresenter } from '../../presenters/presenter-equipment'

export const findByNameDTO = z.object({
  name: z.string().min(2).max(140),
})

export type FindByNameDTO = z.infer<typeof findByNameDTO>

const bodyValidation = new ZodValidationPipe(findByNameDTO)

@Controller('/equipment')
export class FindEquipmentByNameController {
  constructor(
    private readonly findEquipmentByNameService: FindEquipmentByNameService,
  ) {}

  @Get()
  async handle(@Body(bodyValidation) body: FindByNameDTO) {
    const { name } = body

    const receivedEquipment = await this.findEquipmentByNameService.execute({
      name
    })

    if (receivedEquipment.isLeft()) {
      const error = receivedEquipment.value
      switch (error.constructor) {
        case EquipmentNonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 400)
      }
    }

    return { equipment: EquipmentPresenter.toHTTP(receivedEquipment.value) }
  }
}
