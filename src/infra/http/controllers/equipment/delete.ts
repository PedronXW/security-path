
import { EquipmentNonExistsError } from '@/domain/application/errors/EquipmentNonExists'
import { DeleteEquipmentService } from '@/domain/application/services/equipment/delete'
import { Controller, Delete, HttpCode, HttpException, Param } from '@nestjs/common'


@Controller('/equipment')
export class DeleteEquipmentController {
  constructor(private deleteEquipmentService: DeleteEquipmentService) {}

  @Delete("/:id")
  @HttpCode(204)
  async handle(@Param('id') id: string) {

    const result = await this.deleteEquipmentService.execute({
      id,
    })

    if (result.isLeft()) {
      const error = result.value
      switch (error.constructor) {
        case EquipmentNonExistsError:
          throw new HttpException(error.message, 403)
        default:
          throw new HttpException(error.message, 400)
      }
    }

    return { message: 'Equipment deleted' }
  }
}
