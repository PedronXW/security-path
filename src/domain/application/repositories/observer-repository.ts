import { Observer } from '@/domain/enterprise/entities/observer';


export abstract class ObserverRepository {
  abstract createObserver(observer: Observer): Promise<Observer>

  abstract changePassword(id: string, password: string): Promise<Observer>

  abstract deleteObserver(id: string): Promise<boolean>

  abstract editObserver(id: string, observer: Observer): Promise<Observer>

  abstract getObserverByName(name: string): Promise<Observer | null>

  abstract getObserverById(id: string): Promise<Observer | null>

  abstract getAllObservers(page: number, limit: number): Promise<Observer[]>

}
