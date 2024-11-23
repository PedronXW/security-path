import { ServiceError } from '@/@shared/errors/service-error'

export class ObserverAlreadyExistsError extends Error implements ServiceError {
  constructor() {
    super(`Observer already exists`)
  }
}
