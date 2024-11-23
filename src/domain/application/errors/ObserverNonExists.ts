import { ServiceError } from '@/@shared/errors/service-error'

export class ObserverNonExistsError extends Error implements ServiceError {
  constructor() {
    super(`Observer non exists`)
  }
}
