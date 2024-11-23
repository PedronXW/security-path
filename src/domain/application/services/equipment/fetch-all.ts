import { Either, left, right } from '@/@shared/either'
import { Equipment } from '@/domain/enterprise/entities/equipment'
import { Injectable } from '@nestjs/common'
import { EquipmentNonExistsError } from '../../errors/EquipmentNonExists'
import { EquipmentRepository } from '../../repositories/equipment-repository'

type FetchAllEquipmentsServiceResponse = Either<EquipmentNonExistsError, Equipment[]>

@Injectable()
export class FetchAllEquipmentsService {
  constructor(private equipmentRepository: EquipmentRepository) {}

  async execute(
    page: number,
    limit: number,
  ): Promise<FetchAllEquipmentsServiceResponse> {
    const equipment = await this.equipmentRepository.getAllEquipments(page, limit)

    if (!equipment) {
      return left(new EquipmentNonExistsError())
    }

    return right(equipment)
  }
}
