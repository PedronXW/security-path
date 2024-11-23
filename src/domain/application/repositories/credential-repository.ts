import { Credential } from '@/domain/enterprise/entities/credential'

export type EditCredential = {
  name?: string
  email?: string
}

export abstract class CredentialRepository {
  abstract createCredential(credential: Credential): Promise<Credential>

  abstract deleteCredential(id: string): Promise<boolean>

  abstract editCredential(id: string, credential: EditCredential): Promise<Credential>

  abstract getCredentialByName(name: string): Promise<Credential | null>

  abstract getCredentialById(id: string): Promise<Credential | null>

  abstract getAllCredentials(page: number, limit: number): Promise<Credential[]>
}
