import { Entity } from "@/@shared/entities/entity"
import { EntityId } from "@/@shared/entities/entity-id"

export type CallCenterProps = {
  id: EntityId
  name: string
  label: string
  description: string
  password: string
  createdAt: Date
  updatedAt: Date
}

export class CallCenter extends Entity<CallCenterProps> {
  get id(): EntityId {
    return this.props.id
  }

  set id(id: EntityId) {
    this.props.id = id
  }

  get name(): string {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get label(): string {
    return this.props.label
  }

  set label(label: string) {
    this.props.label = label
  }

  get description(): string {
    return this.props.description
  }

  set description(description: string) {
    this.props.description = description
  }

  get password(): string {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  set createdAt(createdAt: Date) {
    this.props.createdAt = createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  set updatedAt(updatedAt: Date) {
    this.props.updatedAt = updatedAt
  }

  static create(
    id: EntityId,
    name: string,
    label: string,
    description: string,
    password: string,
    createdAt: Date,
    updatedAt: Date
  ): CallCenter {
    return new CallCenter({ id, name, label, description, password, createdAt, updatedAt })
  }
}