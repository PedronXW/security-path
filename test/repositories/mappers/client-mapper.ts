import { EntityId } from '@/@shared/entities/entity-id'
import { Client } from '@/domain/enterprise/entities/client'

export class ClientMapper {
  static toDomain(raw): Client {
    return Client.create(
      {
        name: Object.values(raw.name).toString(),
        email: Object.values(raw.email).toString(),
        emailVerified: Object.values(raw.emailVerified).toString() === 'true',
        password: Object.values(raw.password).toString(),
        createdAt: new Date(Object.values(raw.createdAt).toString()),
        updatedAt: raw.updatedAt
          ? new Date(Object.values(raw.updatedAt).toString())
          : null,
      },
      new EntityId(Object.values(raw.id).toString()),
    )
  }

  static toPersistence(Client: Client) {
    return {
      id: { S: Client.id.getValue() },
      name: { S: Client.name },
      email: { S: Client.email },
      emailVerified: { BOOL: Client.emailVerified },
      password: { S: Client.password },
      createdAt: {
        S: Client.createdAt?.toString() || new Date().getTime().toString(),
      },
      updatedAt: Client.updatedAt
        ? {
            S: Client.updatedAt?.toString(),
          }
        : { NULL: true },
    }
  }
}
