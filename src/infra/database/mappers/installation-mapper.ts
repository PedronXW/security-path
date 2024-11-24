import { EntityId } from '@/@shared/entities/entity-id'
import { Installation } from '@/domain/enterprise/entities/installation'

export class InstallationMapper {
  static toDomain(raw): Installation {
    return Installation.create(
      {
        name: Object.values(raw.name).toString(),
        description: Object.values(raw.description).toString(),
        label: Object.values(raw.label).toString(),
        createdAt: new Date(Object.values(raw.createdAt).toString()),
        updatedAt: raw.updatedAt
          ? new Date(Object.values(raw.updatedAt).toString())
          : null,
      },
      new EntityId(Object.values(raw.id).toString()),
    )
  }

  static toPersistence(Installation: Installation) {
    return {
        id: { S: Installation.id.getValue() },
        name: { S: Installation.name },
        label: { S: Installation.label },
        description: { S: Installation.description },
        createdAt: {
            S: Installation.createdAt?.toString() || new Date().getTime().toString(),
        },
        updatedAt:  {
            S: Installation.updatedAt?.toString(),
        }
    }
  }
}
