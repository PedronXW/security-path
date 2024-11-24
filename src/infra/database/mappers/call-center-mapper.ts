import { EntityId } from '@/@shared/entities/entity-id'
import { CallCenter } from '@/domain/enterprise/entities/call-center'

export class CallCenterMapper {
  static toDomain(raw): CallCenter {
    return CallCenter.create(
      {
        name: Object.values(raw.name).toString(),
        label: Object.values(raw.label).toString(),
        description: Object.values(raw.description).toString(),
        createdAt: new Date(Object.values(raw.createdAt).toString()),
        updatedAt: raw.updatedAt
          ? new Date(Object.values(raw.updatedAt).toString())
          : null,
      },
      new EntityId(Object.values(raw.id).toString()),
    )
  }

  static toPersistence(CallCenter: CallCenter) {
    return {
        id: { S: CallCenter.id.getValue() },
        name: { S: CallCenter.name },
        label: { S: CallCenter.label },
        description: { S: CallCenter.description },
        createdAt: {
          S: CallCenter.createdAt?.toString() || new Date().getTime().toString(),
        },
        updatedAt:  {
              S: CallCenter.updatedAt?.toString(),
            }
    }
  }
}
