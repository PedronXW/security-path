import { Entity } from "@/@shared/entities/entity";
import { EntityId } from "@/@shared/entities/entity-id";

export type InstallationProps = {
    id: EntityId;
    name: string;
    description: string;
    label: string;
    createdAt: Date;
    updatedAt: Date;
}

export class Installation extends Entity<InstallationProps>{
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

    static create(props: InstallationProps, id?: EntityId): Installation {
        const installation = new Installation({
                ...props,
                createdAt: props.createdAt || new Date(),
            }, id)

        return installation
        
    }
}