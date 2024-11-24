import { ServiceError } from '@/@shared/errors/service-error'

export class EquipmentAlreadyExistsError extends Error implements ServiceError {
  constructor() {
    super(`Equipment already exists`)
  }
}
