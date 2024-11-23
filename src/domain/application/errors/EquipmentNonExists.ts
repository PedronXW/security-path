import { ServiceError } from '@/@shared/errors/service-error'

export class EquipmentNonExistsError extends Error implements ServiceError {
  constructor() {
    super(`Equipment non exists`)
  }
}
