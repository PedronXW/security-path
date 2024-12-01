import { EquipmentNonExistsError } from '@/domain/application/errors/EquipmentNonExists'
import { FindEquipmentByIdService } from '@/domain/application/services/equipment/find-by-id'
import { Controller, Get, HttpException, Param } from '@nestjs/common'
import { EquipmentPresenter } from '../../presenters/presenter-equipment'


@Controller('/equipment')
export class FindEquipmentByIdController {
  constructor(
    private readonly findEquipmentByIdService: FindEquipmentByIdService,
  ) {}

  @Get("/:id")
  async handle(@Param('id') id: string) {

    const receivedEquipment = await this.findEquipmentByIdService.execute({
      id,
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
