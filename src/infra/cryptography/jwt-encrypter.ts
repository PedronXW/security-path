import { Encrypter } from '@/domain/application/criptography/encrypter'
import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { verify } from 'jsonwebtoken'

type IPayload = { sub: string }

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private jwtService: JwtService) {}

  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload)
  }

  async decrypt(token: string, factor?: string): Promise<string> {
    const { sub } = verify(token, factor) as IPayload
    return sub
  }
}
