import { ServiceError } from '@/@shared/errors/service-error'

export class InstallationNonExistsError extends Error implements ServiceError {
  constructor() {
    super(`Installation non exists`)
  }
}
