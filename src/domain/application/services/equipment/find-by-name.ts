import { Either, left, right } from '@/@shared/either'
import { Equipment } from '@/domain/enterprise/entities/equipment'
import { Injectable } from '@nestjs/common'
import { EquipmentNonExistsError } from '../../errors/EquipmentNonExists'
import { EquipmentRepository } from '../../repositories/equipment-repository'

type FindEquipmentByNameServiceRequest = {
  name: string
}

type FindEquipmentByNameServiceResponse = Either<EquipmentNonExistsError, Equipment>

@Injectable()
export class FindEquipmentByNameService {
  constructor(private equipmentRepository: EquipmentRepository) {}

  async execute({
    name,
  }: FindEquipmentByNameServiceRequest): Promise<FindEquipmentByNameServiceResponse> {
    const equipment = await this.equipmentRepository.getEquipmentByName(name)

    if (!equipment) {
      return left(new EquipmentNonExistsError())
    }

    return right(equipment)
  }
}
