import { ServiceError } from '@/@shared/errors/service-error'

export class CallCenterAlreadyExistsError extends Error implements ServiceError {
  constructor() {
    super(`CallCenter already exists`)
  }
}
