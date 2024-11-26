import { ServiceError } from '@/@shared/errors/service-error'

export class PermissionError extends Error implements ServiceError {
  constructor() {
    super('Without permission to do that action')
  }
}
