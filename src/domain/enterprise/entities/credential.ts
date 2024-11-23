import { Entity } from "@/@shared/entities/entity";
import { EntityId } from "@/@shared/entities/entity-id";
import { Optional } from "@/@shared/types/optional";

export type CredentialProps = {
    password: string;
    createdAt: Date | null;
    updatedAt?: Date | null;
}

export class Credential extends Entity<CredentialProps>{

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

    static create(props: Optional<CredentialProps, 'createdAt'>, id?: EntityId): Credential {
        const credential = new Credential({
                ...props,
                createdAt: props.createdAt || new Date(),
            }, id)

        return credential
    }


}