import { Installation } from '@/domain/enterprise/entities/installation'

export type EditInstallation = {
  name?: string
  email?: string
}

export abstract class InstallationRepository {
  abstract createInstallation(installation: Installation): Promise<Installation>

  abstract deleteInstallation(id: string): Promise<boolean>

  abstract editInstallation(id: string, installation: EditInstallation): Promise<Installation>

  abstract getInstallationByName(name: string): Promise<Installation | null>

  abstract getInstallationById(id: string): Promise<Installation | null>

  abstract getAllInstallations(page: number, limit: number): Promise<Installation[]>
}
