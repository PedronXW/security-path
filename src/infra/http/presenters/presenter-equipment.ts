import { Equipment } from '@/domain/enterprise/entities/equipment'

export type EquipmentHTTP = {
  id: string
  name: string
  description: string
  label: string
  createdAt: Date
  updatedAt: Date
}

export class EquipmentPresenter {
  static toHTTP(equipment: Equipment): EquipmentHTTP {
    return {
      id: equipment.id.getValue(),
      name: equipment.name,
      description: equipment.description,
      createdAt: equipment.createdAt,
      label: equipment.label,
      updatedAt: equipment.updatedAt,
    }
  }
}
