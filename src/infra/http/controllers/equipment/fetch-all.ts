import { EquipmentNonExistsError } from '@/domain/application/errors/EquipmentNonExists'
import { FetchAllEquipmentsService } from '@/domain/application/services/equipment/fetch-all'
import { Body, Controller, Get, HttpException } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'
import { EquipmentPresenter } from '../../presenters/presenter-equipment'


const fetchAllEquipmentsDTO = z.object({
  limit: z.number().int().positive().optional(),
  page: z.number().int().positive().optional(),
})

export type FetchAllEquipmentsDTO = z.infer<typeof fetchAllEquipmentsDTO>

const bodyValidation = new ZodValidationPipe(fetchAllEquipmentsDTO)


@Controller('/equipment')
export class FetchAllEquipmentsController {
  constructor(
    private readonly fetchAllEquipmentsService: FetchAllEquipmentsService,
  ) {}

  @Get()
  async handle(@Body(bodyValidation) body: FetchAllEquipmentsDTO) {
    const { page, limit } = body

    const receivedEquipment = await this.fetchAllEquipmentsService.execute(page, limit)

    if (receivedEquipment.isLeft()) {
      const error = receivedEquipment.value
      switch (error.constructor) {
        case EquipmentNonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 400)
      }
    }

    return { equipment: receivedEquipment.value.map(EquipmentPresenter.toHTTP) }
  }
}
