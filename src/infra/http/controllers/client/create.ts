
import { CreateClientService } from '@/domain/application/services/client/create'
import { Public } from '@/infra/auth/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { Body, Controller, HttpException, Post } from '@nestjs/common'
import { z } from 'zod'
import { ClientPresenter } from '../../presenters/presenter-client'

const createClientDTO = z.object({
  name: z.string().min(2).max(140),
  email: z.string().email().max(140),
  password: z.string().min(8),
})

export type CreateClientDTO = z.infer<typeof createClientDTO>

const bodyValidation = new ZodValidationPipe(createClientDTO)

@Public()
@Controller('/client')
export class CreateClientController {
  constructor(private createClientService: CreateClientService) {}

  @Post()
  async handle(@Body(bodyValidation) body: CreateClientDTO) {
    const { name, email, password } = body

    const client = await this.createClientService.execute({
      name,
      email,
      password,
    })

    if (client.isLeft()) {
      const error = client.value
      switch (error.constructor) {
        default:
          throw new HttpException('Error creating client', 400)
      }
    }

    return { client: ClientPresenter.toHTTP(client.value) }
  }
}
