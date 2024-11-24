import { DomainEvents } from '@/@shared/events/event-dispatcher'
import {
  ClientRepository,
  EditClient,
} from '@/domain/application/repositories/client-repository'
import { Client } from '@/domain/enterprise/entities/client'
import { EnvService } from '@/infra/env/env.service'
import {
  DeleteItemCommand,
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
  UpdateItemCommand,
} from '@aws-sdk/client-dynamodb'
import { ClientMapper } from '../mappers/client-mapper'

export class DynamoClientRepository implements ClientRepository {

  constructor(private env: EnvService){}

  async createConnection(): Promise<DynamoDBClient> {
    const dbClient = new DynamoDBClient({
      region: this.env.get('DYNAMODB_REGION'),
      endpoint: this.env.get("DYNAMODB_ENDPOINT"),
      credentials: {
        accessKeyId: this.env.get("DYNAMODB_ACCESS_KEY"),
        secretAccessKey: this.env.get("DYNAMODB_SECRET_KEY"),
      },
    })
    return dbClient
  }

  async createClient(client: Client): Promise<Client> {

    const dbClient = await this.createConnection()

    await dbClient.send(
      new PutItemCommand({
        TableName: this.env.get("DYNAMODB_CLIENT_TABLE"),
        Item: { ...ClientMapper.toPersistence(client) },
      }),
    )

    DomainEvents.markAggregateForDispatch(client)

    DomainEvents.dispatchEventsForAggregate(client.id)

    console.log('Client created')

    return client
  }

  async changePassword(id: string, password: string): Promise<Client> {
    const dbClient = await this.createConnection()
    const client = await dbClient.send(
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

    return ClientMapper.toDomain(client.Attributes)
  }

  async deleteClient(id: string): Promise<boolean> {
    const dbClient = await this.createConnection()
    const deleteResult = await dbClient.send(
      new DeleteItemCommand({
        TableName: this.env.get("DYNAMODB_CLIENT_TABLE"),
        Key: { id: { S: id } },
      }),
    )

    return !!deleteResult
  }

  async verifyClientEmail(id: string): Promise<Client> {
    const dbClient = await this.createConnection()
    const client = await dbClient.send(
      new UpdateItemCommand({
        TableName: this.env.get("DYNAMODB_CLIENT_TABLE"),
        Key: { id: { S: id } },
        UpdateExpression: 'SET #e = :e',
        ExpressionAttributeValues: {
          ':e': { BOOL: true },
        },
        ExpressionAttributeNames: {
          '#e': 'emailVerified',
        },
        ReturnValues: 'ALL_NEW',
      }),
    )

    return ClientMapper.toDomain(client.Attributes)
  }

  async editClient(id: string, { name, email }: EditClient): Promise<Client> {
    const dbClient = await this.createConnection()
    const expression = {}

    let updateExpression = 'SET '

    const expressionAttributeNames = {}

    if (name) {
      expressionAttributeNames['#n'] = 'name'
      expression[':n'] = { S: name }
      updateExpression += '#n = :n'
    }

    if (name && email) {
      updateExpression += ','
    }

    if (email) {
      expressionAttributeNames['#e'] = 'email'
      expression[':e'] = { S: email }
      updateExpression += ' #e = :e'
    }

    const client = await dbClient.send(
      new UpdateItemCommand({
        TableName: this.env.get("DYNAMODB_CLIENT_TABLE"),
        Key: { id: { S: id } },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expression,
        ExpressionAttributeNames: expressionAttributeNames,
        ReturnValues: 'ALL_NEW',
      }),
    )

    return ClientMapper.toDomain(client.Attributes)
  }

  async getClientByEmail(email: string): Promise<Client | null> {
    const dbClient = await this.createConnection()
    const client = await dbClient.send(
      new QueryCommand({
        TableName: this.env.get("DYNAMODB_CLIENT_TABLE"),
        IndexName: 'email-index',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': { S: email },
        },
        Limit: 1,
      }),
    )

    if (!client.Items?.length) {
      return null
    }

    return ClientMapper.toDomain(client.Items[0])
  }

  async getClientById(id: string): Promise<Client | null> {
    const dbClient = await this.createConnection()
    const client = await dbClient.send(
      new QueryCommand({
        TableName: this.env.get("DYNAMODB_CLIENT_TABLE"),
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
          ':id': { S: id },
        },
        Limit: 1,
      }),
    )

    if (!client.Items) {
      return null
    }

    return ClientMapper.toDomain(client.Items[0])
  }

  async getAllClients(page: number, limit: number): Promise<Client[]> {
    const dbClient = await this.createConnection()
    const clients = await dbClient.send(
      new ScanCommand({
        TableName: this.env.get("DYNAMODB_CLIENT_TABLE"),
        Limit: limit,
        ExclusiveStartKey:
          page > 1 ? { id: { S: page.toString() } } : undefined,
      }),
    )

    if (!clients.Items) {
      return []
    }

    return clients.Items.map((client) => ClientMapper.toDomain(client))
  }
}
