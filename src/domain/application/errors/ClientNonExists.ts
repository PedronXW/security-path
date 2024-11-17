import { ServiceError } from '@/@shared/errors/service-error'

export class ClientNonExistsError extends Error implements ServiceError {
  constructor() {
    super(`Client non exists`)
  }
}
