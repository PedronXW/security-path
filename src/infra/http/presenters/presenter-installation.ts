import { Installation } from '@/domain/enterprise/entities/installation'

export type InstallationHTTP = {
  id: string
  name: string
  description: string
  label: string
  createdAt: Date
  updatedAt: Date
}

export class InstallationPresenter {
  static toHTTP(installation: Installation): InstallationHTTP {
    return {
      id: installation.id.getValue(),
      name: installation.name,
      description: installation.description,
      createdAt: installation.createdAt,
      label: installation.label,
      updatedAt: installation.updatedAt,
    }
  }
}
