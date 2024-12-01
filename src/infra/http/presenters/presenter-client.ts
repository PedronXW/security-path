import { Client } from '@/domain/enterprise/entities/client'

export type ClientHTTP = {
  id: string
  name: string
  email: string
  password: string
}

export class ClientPresenter {
  static toHTTP(client: Client): ClientHTTP {
    return {
      id: client.id.getValue(),
      name: client.name,
      email: client.email,
      password: client.password,
    }
  }
}
