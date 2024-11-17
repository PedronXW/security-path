import { ServiceError } from '@/@shared/errors/service-error'

export class ClientEmailNotVerifiedError extends Error implements ServiceError {
  constructor() {
    super(`Client email not verified`)
  }
}
