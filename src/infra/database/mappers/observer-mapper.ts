import { EntityId } from '@/@shared/entities/entity-id'
import { Observer } from '@/domain/enterprise/entities/observer'

export class ObserverMapper {
  static toDomain(raw): Observer {
    return Observer.create(
      {
        name: Object.values(raw.name).toString(),
        label: Object.values(raw.label).toString(),
        description: Object.values(raw.description).toString(),
        password: Object.values(raw.password).toString(),
        createdAt: new Date(Object.values(raw.createdAt).toString()),
        updatedAt: raw.updatedAt
          ? new Date(Object.values(raw.updatedAt).toString())
          : null,
      },
      new EntityId(Object.values(raw.id).toString()),
    )
  }

  static toPersistence(Observer: Observer) {
    return {
        id: { S: Observer.id.getValue() },
        name: { S: Observer.name },
        label: { S: Observer.label },
        description: { S: Observer.description },
        password: { S: Observer.password },
        createdAt: {
            S: Observer.createdAt?.toString() || new Date().getTime().toString(),
        },
        updatedAt:  {
            S: Observer.updatedAt?.toString(),
        }
    }
  }
}
