import { Entity } from "@/@shared/entities/entity";
import { EntityId } from "@/@shared/entities/entity-id";

export type CredentialProps = {
    id: EntityId;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export class Credential extends Entity<CredentialProps>{
    get id(): EntityId {
        return this.props.id
    }

    set id(id: EntityId) {
        this.props.id = id
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

    static create(props: CredentialProps, id?: EntityId): Credential {
        const credential = new Credential({
                ...props,
                createdAt: props.createdAt || new Date(),
            }, id)

        return credential
        
    }


}