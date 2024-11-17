import { ServiceError } from '@/@shared/errors/service-error'

export class ClientAlreadyExistsError extends Error implements ServiceError {
  constructor() {
    super(`Client already exists`)
  }
}
