import { Public } from '@/infra/auth/public'

import { WrongCredentialError } from '@/domain/application/errors/WrongCredentialsError'
import { AuthenticateClientService } from '@/domain/application/services/client/authenticate'
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

export const authenticateClientDTO = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type AuthenticateClientDTO = z.infer<typeof authenticateClientDTO>

@Public()
@Controller('/session')
export class AuthenticateController {
  constructor(
    private authenticateClientService: AuthenticateClientService,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(authenticateClientDTO))
  async handle(@Body() body: AuthenticateClientDTO) {
    const { email, password } = body

    const token = await this.authenticateClientService.execute({
      email,
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
