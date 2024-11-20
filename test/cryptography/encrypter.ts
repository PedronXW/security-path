import { Encrypter as EncryptInterface } from '@/domain/application/criptography/encrypter'
import { sign, verify } from 'jsonwebtoken'

type IPayload = { sub: string }

export class Encrypter implements EncryptInterface {
  async encrypt(
    payload: Record<string, unknown>,
    factor: string = 'test',
  ): Promise<string> {
    return sign({}, factor, {
      subject: payload.id as string,
      expiresIn: '1d',
    })
  }

  async decrypt(
    token: string,
    factor: string = 'test',
  ): Promise<string> {
    const { sub } = verify(token, factor) as IPayload
    return sub
  }
}
