import { ServiceError } from '@/@shared/errors/service-error'

export class MessageNonExistsError extends Error implements ServiceError {
  constructor() {
    super(`Message non exists`)
  }
}
