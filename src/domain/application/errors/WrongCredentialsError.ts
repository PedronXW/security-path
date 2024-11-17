import { ServiceError } from '@/@shared/errors/service-error'

export class WrongCredentialError extends Error implements ServiceError {
  constructor() {
    super(`Wrong credentials`)
  }
}
