import { Either, left, right } from '@/@shared/either'
import { Equipment } from '@/domain/enterprise/entities/equipment'
import { Injectable } from '@nestjs/common'
import { EquipmentNonExistsError } from '../../errors/EquipmentNonExists'
import { EquipmentRepository } from '../../repositories/equipment-repository'

type FindEquipmentByIdServiceRequest = {
  id: string
}

type FindEquipmentByIdServiceResponse = Either<EquipmentNonExistsError, Equipment>

@Injectable()
export class FindEquipmentByIdService {
  constructor(private equipmentRepository: EquipmentRepository) {}

  async execute({
    id,
  }: FindEquipmentByIdServiceRequest): Promise<FindEquipmentByIdServiceResponse> {
    const equipment = await this.equipmentRepository.getEquipmentById(id)

    if (!equipment) {
      return left(new EquipmentNonExistsError())
    }

    return right(equipment)
  }
}
