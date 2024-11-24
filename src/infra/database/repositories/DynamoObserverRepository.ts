import { DomainEvents } from '@/@shared/events/event-dispatcher'
import {
  ObserverRepository
} from '@/domain/application/repositories/observer-repository'
import { Observer } from '@/domain/enterprise/entities/observer'
import { EnvService } from '@/infra/env/env.service'
import {
  DeleteItemCommand,
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
  UpdateItemCommand
} from '@aws-sdk/client-dynamodb'
import { ObserverMapper } from '../mappers/observer-mapper'

export class DynamoObserverRepository implements ObserverRepository {

  constructor(private env: EnvService){}

  async createConnection(): Promise<DynamoDBClient> {
    const dbObserver = new DynamoDBClient({
      region: this.env.get('DYNAMODB_REGION'),
      endpoint: this.env.get("DYNAMODB_ENDPOINT"),
      credentials: {
        accessKeyId: this.env.get("DYNAMODB_ACCESS_KEY"),
        secretAccessKey: this.env.get("DYNAMODB_SECRET_KEY"),
      },
    })
    return dbObserver
  }

  async createObserver(observer: Observer): Promise<Observer> {

    const dbObserver = await this.createConnection()

    await dbObserver.send(
      new PutItemCommand({
        TableName: this.env.get("DYNAMODB_OBSERVER_TABLE"),
        Item: { ...ObserverMapper.toPersistence(observer) },
      }),
    )

    DomainEvents.markAggregateForDispatch(observer)

    DomainEvents.dispatchEventsForAggregate(observer.id)

    console.log('Observer created')

    return observer
  }

  async deleteObserver(id: string): Promise<boolean> {
    const dbObserver = await this.createConnection()
    const deleteResult = await dbObserver.send(
      new DeleteItemCommand({
        TableName: this.env.get("DYNAMODB_OBSERVER_TABLE"),
        Key: { id: { S: id } },
      }),
    )

    return !!deleteResult
  }

  async editObserver(id: string, observer: Observer): Promise<Observer> {
    const dbObserver = await this.createConnection()

    await dbObserver.send(
      new UpdateItemCommand({
        TableName: this.env.get("DYNAMODB_OBSERVER_TABLE"),
        Key: { id: { S: id } },
        UpdateExpression: 'SET #n = :n, #l = :l, #d = :d, #c = :c',
        ExpressionAttributeValues: {
          ':n': { S: observer.name },
          ':l': { S: observer.label },
          ':d': { S: observer.description },
        },
        ExpressionAttributeNames: {
          '#n': 'name',
          '#l': 'label',
          '#d': 'description',
        },
        ReturnValues: 'ALL_NEW',
      }),
    )

    return ObserverMapper.toDomain(observer)
  }

  async getObserverByName(name: string): Promise<Observer | null> {
    const dbObserver = await this.createConnection()
    const observer = await dbObserver.send(
      new QueryCommand({
        TableName: this.env.get("DYNAMODB_OBSERVER_TABLE"),
        IndexName: 'name-index',
        KeyConditionExpression: 'name = :name',
        ExpressionAttributeValues: {
          ':name': { S: name },
        },
        Limit: 1,
      }),
    )

    if (!observer.Items?.length) {
      return null
    }

    return ObserverMapper.toDomain(observer.Items[0])
  }

  async changePassword(id: string, password: string): Promise<Observer> {
    const dbClient = await this.createConnection()
    const observer = await dbClient.send(
      new UpdateItemCommand({
        TableName: this.env.get("DYNAMODB_CLIENT_TABLE"),
        Key: { id: { S: id } },
        UpdateExpression: 'SET #p = :p',
        ExpressionAttributeValues: {
          ':p': { S: password },
        },
        ExpressionAttributeNames: {
          '#p': 'password',
        },
        ReturnValues: 'ALL_NEW',
      }),
    )

    return ObserverMapper.toDomain(observer.Attributes)
  }

  async getObserverById(id: string): Promise<Observer | null> {
    const dbObserver = await this.createConnection()
    const observer = await dbObserver.send(
      new QueryCommand({
        TableName: this.env.get("DYNAMODB_OBSERVER_TABLE"),
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
          ':id': { S: id },
        },
        Limit: 1,
      }),
    )

    if (!observer.Items) {
      return null
    }

    return ObserverMapper.toDomain(observer.Items[0])
  }

  async getAllObservers(page: number, limit: number): Promise<Observer[]> {
    const dbObserver = await this.createConnection()
    const observers = await dbObserver.send(
      new ScanCommand({
        TableName: this.env.get("DYNAMODB_OBSERVER_TABLE"),
        Limit: limit,
        ExclusiveStartKey:
          page > 1 ? { id: { S: page.toString() } } : undefined,
      }),
    )

    if (!observers.Items) {
      return []
    }

    return observers.Items.map((observer) => ObserverMapper.toDomain(observer))
  }
}
