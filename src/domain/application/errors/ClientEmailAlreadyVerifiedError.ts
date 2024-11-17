import { ServiceError } from '@/@shared/errors/service-error'

export class ClientEmailAlreadyVerifiedError
  extends Error
  implements ServiceError
{
  constructor() {
    super(`Client email already verified`)
  }
}
