import { Either, left, right } from '@/@shared/either'
import { EnvService } from '@/infra/env/env.service'
import { Injectable } from '@nestjs/common'
import { Encrypter } from '../../criptography/encrypter'
import { HashGenerator } from '../../criptography/hash-generator'
import { ClientNonExistsError } from '../../errors/ClientNonExists'
import { ClientRepository } from '../../repositories/client-repository'

type ResetClientPasswordServiceRequest = {
  id: string
  password: string
}

type ResetClientPasswordServiceResponse = Either<ClientNonExistsError, null>

@Injectable()
export class ResetClientPasswordService {
  constructor(
    private clientRepository: ClientRepository,
    private hashGenerator: HashGenerator,
    private encrypter: Encrypter,
    private envService: EnvService
  ) {}

  async execute({
    id,
    password,
  }: ResetClientPasswordServiceRequest): Promise<ResetClientPasswordServiceResponse> {
    const userId = await this.encrypter.decrypt(id, this.envService.get("JWT_SECRET"))

    const clientExists = await this.clientRepository.getClientById(userId)

    if (!clientExists) {
      return left(new ClientNonExistsError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    await this.clientRepository.changePassword(userId, hashedPassword)

    return right(null)
  }
}
