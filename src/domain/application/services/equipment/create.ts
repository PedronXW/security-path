import { Either, left, right } from '@/@shared/either'
import { Equipment } from '@/domain/enterprise/entities/equipment'
import { Injectable } from '@nestjs/common'
import { EquipmentAlreadyExistsError } from '../../errors/EquipmentAlreadyExistsError'
import { EquipmentRepository } from '../../repositories/equipment-repository'

interface CreateEquipmentServiceRequest {
  name: string
  label: string
  description: string
  credential: string
}

type CreateEquipmentServiceResponse = Either<EquipmentAlreadyExistsError, Equipment>

@Injectable()
export class CreateEquipmentService {
  constructor(
    private equipmentRepository: EquipmentRepository,
  ) {}

  async execute({
    name,
    label,
    description,
    credential
  }: CreateEquipmentServiceRequest): Promise<CreateEquipmentServiceResponse> {
    const equipmentExists = await this.equipmentRepository.getEquipmentByName(name)

    if (equipmentExists) {
      return left(new EquipmentAlreadyExistsError())
    }

    const equipment = Equipment.create({
      name,
      label,
      description,
      credential,
    })

    const newEquipment = await this.equipmentRepository.createEquipment(equipment)

    return right(newEquipment)
  }
}
