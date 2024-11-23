import { ServiceError } from '@/@shared/errors/service-error'

export class CallCenterNonExistsError extends Error implements ServiceError {
  constructor() {
    super(`CallCenter non exists`)
  }
}
