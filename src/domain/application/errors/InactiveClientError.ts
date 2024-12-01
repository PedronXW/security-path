import { ServiceError } from '@/@shared/errors/service-error'

export class InactiveClientError extends Error implements ServiceError {
  constructor() {
    super(`Inactive client error`)
  }
}
