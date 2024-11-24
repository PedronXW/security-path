import { DomainEvents } from '@/@shared/events/event-dispatcher'
import {
  CallCenterRepository
} from '@/domain/application/repositories/call-center-repository'
import { CallCenter } from '@/domain/enterprise/entities/call-center'
import { EnvService } from '@/infra/env/env.service'
import {
  DeleteItemCommand,
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
  UpdateItemCommand
} from '@aws-sdk/client-dynamodb'
import { CallCenterMapper } from '../mappers/call-center-mapper'

export class DynamoCallCenterRepository implements CallCenterRepository {

  constructor(private env: EnvService){}

  async createConnection(): Promise<DynamoDBClient> {
    const dbCallCenter = new DynamoDBClient({
      region: this.env.get('DYNAMODB_REGION'),
      endpoint: this.env.get("DYNAMODB_ENDPOINT"),
      credentials: {
        accessKeyId: this.env.get("DYNAMODB_ACCESS_KEY"),
        secretAccessKey: this.env.get("DYNAMODB_SECRET_KEY"),
      },
    })
    return dbCallCenter
  }

  async createCallCenter(callcenter: CallCenter): Promise<CallCenter> {

    const dbCallCenter = await this.createConnection()

    await dbCallCenter.send(
      new PutItemCommand({
        TableName: this.env.get("DYNAMODB_CALL_CENTER_TABLE"),
        Item: { ...CallCenterMapper.toPersistence(callcenter) },
      }),
    )

    DomainEvents.markAggregateForDispatch(callcenter)

    DomainEvents.dispatchEventsForAggregate(callcenter.id)

    console.log('CallCenter created')

    return callcenter
  }

  async deleteCallCenter(id: string): Promise<boolean> {
    const dbCallCenter = await this.createConnection()
    const deleteResult = await dbCallCenter.send(
      new DeleteItemCommand({
        TableName: this.env.get("DYNAMODB_CALL_CENTER_TABLE"),
        Key: { id: { S: id } },
      }),
    )

    return !!deleteResult
  }

  async editCallCenter(id: string, callcenter: CallCenter): Promise<CallCenter> {
    const dbCallCenter = await this.createConnection()

    await dbCallCenter.send(
      new UpdateItemCommand({
        TableName: this.env.get("DYNAMODB_CALL_CENTER_TABLE"),
        Key: { id: { S: id } },
        UpdateExpression: 'SET #n = :n, #l = :l, #d = :d, #c = :c',
        ExpressionAttributeValues: {
          ':n': { S: callcenter.name },
          ':l': { S: callcenter.label },
          ':d': { S: callcenter.description },
        },
        ExpressionAttributeNames: {
          '#n': 'name',
          '#l': 'label',
          '#d': 'description',
        },
        ReturnValues: 'ALL_NEW',
      }),
    )

    return CallCenterMapper.toDomain(callcenter)
  }

  async getCallCenterByName(name: string): Promise<CallCenter | null> {
    const dbCallCenter = await this.createConnection()
    const callcenter = await dbCallCenter.send(
      new QueryCommand({
        TableName: this.env.get("DYNAMODB_CALL_CENTER_TABLE"),
        IndexName: 'name-index',
        KeyConditionExpression: 'name = :name',
        ExpressionAttributeValues: {
          ':name': { S: name },
        },
        Limit: 1,
      }),
    )

    if (!callcenter.Items?.length) {
      return null
    }

    return CallCenterMapper.toDomain(callcenter.Items[0])
  }

  async getCallCenterById(id: string): Promise<CallCenter | null> {
    const dbCallCenter = await this.createConnection()
    const callcenter = await dbCallCenter.send(
      new QueryCommand({
        TableName: this.env.get("DYNAMODB_CALL_CENTER_TABLE"),
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
          ':id': { S: id },
        },
        Limit: 1,
      }),
    )

    if (!callcenter.Items) {
      return null
    }

    return CallCenterMapper.toDomain(callcenter.Items[0])
  }

  async getAllCallCenters(page: number, limit: number): Promise<CallCenter[]> {
    const dbCallCenter = await this.createConnection()
    const callcenters = await dbCallCenter.send(
      new ScanCommand({
        TableName: this.env.get("DYNAMODB_CALL_CENTER_TABLE"),
        Limit: limit,
        ExclusiveStartKey:
          page > 1 ? { id: { S: page.toString() } } : undefined,
      }),
    )

    if (!callcenters.Items) {
      return []
    }

    return callcenters.Items.map((callcenter) => CallCenterMapper.toDomain(callcenter))
  }
}
