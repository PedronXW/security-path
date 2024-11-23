import { Entity } from "@/@shared/entities/entity";
import { EntityId } from "@/@shared/entities/entity-id";
import { Optional } from "@/@shared/types/optional";

export type ObserverProps = {
    name: string;
    description: string;
    label: string;
    password: string;
    createdAt: Date | null;
    updatedAt?: Date | null;
}

export class Observer extends Entity<ObserverProps>{

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

    static create(props: Optional<ObserverProps, 'createdAt'>, id?: EntityId): Observer {
        return new Observer({
            ...props,
            createdAt: new Date()
        }, id)
    }
}