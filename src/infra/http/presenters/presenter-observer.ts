import { Observer } from '@/domain/enterprise/entities/observer'

export type ObserverHTTP = {
  id: string
  name: string
  description: string
  label: string
  createdAt: Date
  updatedAt: Date
}

export class ObserverPresenter {
  static toHTTP(observer: Observer): ObserverHTTP {
    return {
      id: observer.id.getValue(),
      name: observer.name,
      description: observer.description,
      createdAt: observer.createdAt,
      label: observer.label,
      updatedAt: observer.updatedAt,
    }
  }
}
