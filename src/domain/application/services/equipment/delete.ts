import { Either, left, right } from '@/@shared/either'
import { Injectable } from '@nestjs/common'
import { EquipmentNonExistsError } from '../../errors/EquipmentNonExists'
import { EquipmentRepository } from '../../repositories/equipment-repository'

type DeleteEquipmentServiceRequest = {
  id: string
}

type DeleteEquipmentServiceResponse = Either<EquipmentNonExistsError, boolean>

@Injectable()
export class DeleteEquipmentService {
  constructor(private equipmentRepository: EquipmentRepository) {}

  async execute({
    id,
  }: DeleteEquipmentServiceRequest): Promise<DeleteEquipmentServiceResponse> {
    const equipment = await this.equipmentRepository.getEquipmentById(id)

    if (!equipment) {
      return left(new EquipmentNonExistsError())
    }

    const result = await this.equipmentRepository.deleteEquipment(id)

    return right(result)
  }
}
