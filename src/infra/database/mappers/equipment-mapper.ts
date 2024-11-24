import { EntityId } from '@/@shared/entities/entity-id'
import { Equipment } from '@/domain/enterprise/entities/equipment'

export class EquipmentMapper {
  static toDomain(raw): Equipment {
    return Equipment.create(
      {
        name: Object.values(raw.name).toString(),
        description: Object.values(raw.description).toString(),
        label: Object.values(raw.label).toString(),
        credential: Object.values(raw.credential).toString(),
        createdAt: new Date(Object.values(raw.createdAt).toString()),
        updatedAt: raw.updatedAt
          ? new Date(Object.values(raw.updatedAt).toString())
          : null,
      },
      new EntityId(Object.values(raw.id).toString()),
    )
  }

  static toPersistence(Equipment: Equipment) {
    return {
        id: { S: Equipment.id.getValue() },
        name: { S: Equipment.name },
        label: { S: Equipment.label },
        description: { S: Equipment.description },
        credential: { S: Equipment.credential },
        createdAt: {
            S: Equipment.createdAt?.toString() || new Date().getTime().toString(),
        },
        updatedAt:  {
            S: Equipment.updatedAt?.toString(),
          }
    }
  }
}
