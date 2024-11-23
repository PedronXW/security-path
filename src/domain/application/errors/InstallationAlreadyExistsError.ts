import { ServiceError } from '@/@shared/errors/service-error'

export class InstallationAlreadyExistsError extends Error implements ServiceError {
  constructor() {
    super(`Installation already exists`)
  }
}
