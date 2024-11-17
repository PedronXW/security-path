export abstract class Encrypter {
  abstract encrypt(
    payload: Record<string, unknown>,
    factor?: string,
  ): Promise<string>

  abstract decrypt(token: string, factor?: string): Promise<string>
}
