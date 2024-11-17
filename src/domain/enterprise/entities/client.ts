import { Entity } from '../../../@shared/entities/entity'
import { EntityId } from '../../../@shared/entities/entity-id'
import { Optional } from '../../../@shared/types/optional'

type ClientProps = {
  name: string
  email: string
  emailVerified: boolean
  password: string
  createdAt: Date | null
  updatedAt?: Date | null
}

export class Client extends Entity<ClientProps> {
  get name(): string {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get email(): string {
    return this.props.email
  }

  set email(email: string) {
    this.props.email = email
  }

  get emailVerified(): boolean {
    return this.props.emailVerified
  }

  set emailVerified(emailVerified: boolean) {
    this.props.emailVerified = emailVerified
  }

  get password(): string {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
  }

  get createdAt(): Date | null {
    return this.props.createdAt
  }

  set createdAt(createdAt: Date | null) {
    this.props.createdAt = createdAt
  }

  get updatedAt(): Date | null | undefined {
    return this.props.updatedAt
  }

  set updatedAt(updatedAt: Date | null | undefined) {
    this.props.updatedAt = updatedAt
  }

  static create(
    props: Optional<ClientProps, 'createdAt' | 'emailVerified'>,
    id?: EntityId,
  ): Client {
    const client = new Client(
      {
        ...props,
        emailVerified: props.emailVerified || false,
        createdAt: new Date(),
      },
      id,
    )

    return client
  }
}
