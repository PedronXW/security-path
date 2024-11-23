import { Either, left, right } from '@/@shared/either'
import { Equipment } from '@/domain/enterprise/entities/equipment'
import { Injectable } from '@nestjs/common'
import { EquipmentNonExistsError } from '../../errors/EquipmentNonExists'
import { EquipmentRepository } from '../../repositories/equipment-repository'

type EditEquipmentServiceRequest = {
  name?: string
  email?: string
}

type EditEquipmentServiceResponse = Either<EquipmentNonExistsError, Equipment>

@Injectable()
export class EditEquipmentService {
  constructor(private equipmentRepository: EquipmentRepository) {}

  async execute(
    id: string,
    { name, email }: EditEquipmentServiceRequest,
  ): Promise<EditEquipmentServiceResponse> {
    const equipment = await this.equipmentRepository.getEquipmentById(id)

    if (!equipment) {
      return left(new EquipmentNonExistsError())
    }

    const updatedEquipment = await this.equipmentRepository.editEquipment(id, {
      name,
      email,
    })

    return right(updatedEquipment)
  }
}
