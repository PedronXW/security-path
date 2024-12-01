import { Public } from '@/infra/auth/public'

import { WrongCredentialError } from '@/domain/application/errors/WrongCredentialsError'
import { AuthenticateObserverService } from '@/domain/application/services/observer/authenticate'
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation-pipe'

export const authenticateObserverDTO = z.object({
  name: z.string().min(2).max(140),
  password: z.string().min(8),
})

export type AuthenticateObserverDTO = z.infer<typeof authenticateObserverDTO>

@Public()
@Controller('/session')
export class AuthenticateObserverController {
  constructor(
    private authenticateObserverService: AuthenticateObserverService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateObserverDTO))
  async handle(@Body() body: AuthenticateObserverDTO) {
    const { name, password } = body

    const token = await this.authenticateObserverService.execute({
      name,
      password,
    })

    if (token.isLeft()) {
      const error = token.value
      switch (error.constructor) {
        case WrongCredentialError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    return { token: token.value.token }
  }
}
