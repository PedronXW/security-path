import { Entity } from "@/@shared/entities/entity";
import { EntityId } from "@/@shared/entities/entity-id";

export type EquipmentProps = {
    id: EntityId;
    name: string;
    description: string;
    label: string;
    createdAt: Date;
    updatedAt: Date;
}

export class Equipment extends Entity<EquipmentProps>{
    get id(): EntityId {
        return this.props.id
    }

    set id(id: EntityId) {
        this.props.id = id
    }

    get label(): string {
        return this.props.label
    }

    set label(label: string) {
        this.props.label = label
    }

    get name(): string {
        return this.props.name
    }

    set name(name: string) {
        this.props.name = name
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

    static create(props: EquipmentProps, id?: EntityId): Equipment {
        const equipment = new Equipment({
                ...props,
                createdAt: props.createdAt || new Date(),
            }, id)

        return equipment
        
    }
}