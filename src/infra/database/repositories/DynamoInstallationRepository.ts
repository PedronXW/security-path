import { DomainEvents } from '@/@shared/events/event-dispatcher'
import {
  InstallationRepository
} from '@/domain/application/repositories/installation-repository'
import { Installation } from '@/domain/enterprise/entities/installation'
import { EnvService } from '@/infra/env/env.service'
import {
  DeleteItemCommand,
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
  UpdateItemCommand
} from '@aws-sdk/client-dynamodb'
import { InstallationMapper } from '../mappers/installation-mapper'

export class DynamoInstallationRepository implements InstallationRepository {

  constructor(private env: EnvService){}

  async createConnection(): Promise<DynamoDBClient> {
    const dbInstallation = new DynamoDBClient({
      region: this.env.get('DYNAMODB_REGION'),
      endpoint: this.env.get("DYNAMODB_ENDPOINT"),
      credentials: {
        accessKeyId: this.env.get("DYNAMODB_ACCESS_KEY"),
        secretAccessKey: this.env.get("DYNAMODB_SECRET_KEY"),
      },
    })
    return dbInstallation
  }

  async createInstallation(installation: Installation): Promise<Installation> {

    const dbInstallation = await this.createConnection()

    await dbInstallation.send(
      new PutItemCommand({
        TableName: this.env.get("DYNAMODB_INSTALLATION_TABLE"),
        Item: { ...InstallationMapper.toPersistence(installation) },
      }),
    )

    DomainEvents.markAggregateForDispatch(installation)

    DomainEvents.dispatchEventsForAggregate(installation.id)

    console.log('Installation created')

    return installation
  }

  async deleteInstallation(id: string): Promise<boolean> {
    const dbInstallation = await this.createConnection()
    const deleteResult = await dbInstallation.send(
      new DeleteItemCommand({
        TableName: this.env.get("DYNAMODB_INSTALLATION_TABLE"),
        Key: { id: { S: id } },
      }),
    )

    return !!deleteResult
  }

  async editInstallation(id: string, installation: Installation): Promise<Installation> {
    const dbInstallation = await this.createConnection()

    await dbInstallation.send(
      new UpdateItemCommand({
        TableName: this.env.get("DYNAMODB_INSTALLATION_TABLE"),
        Key: { id: { S: id } },
        UpdateExpression: 'SET #n = :n, #l = :l, #d = :d, #c = :c',
        ExpressionAttributeValues: {
          ':n': { S: installation.name },
          ':l': { S: installation.label },
          ':d': { S: installation.description },
        },
        ExpressionAttributeNames: {
          '#n': 'name',
          '#l': 'label',
          '#d': 'description',
        },
        ReturnValues: 'ALL_NEW',
      }),
    )

    return InstallationMapper.toDomain(installation)
  }

  async getInstallationByName(name: string): Promise<Installation | null> {
    const dbInstallation = await this.createConnection()
    const installation = await dbInstallation.send(
      new QueryCommand({
        TableName: this.env.get("DYNAMODB_INSTALLATION_TABLE"),
        IndexName: 'name-index',
        KeyConditionExpression: 'name = :name',
        ExpressionAttributeValues: {
          ':name': { S: name },
        },
        Limit: 1,
      }),
    )

    if (!installation.Items?.length) {
      return null
    }

    return InstallationMapper.toDomain(installation.Items[0])
  }

  async getInstallationById(id: string): Promise<Installation | null> {
    const dbInstallation = await this.createConnection()
    const installation = await dbInstallation.send(
      new QueryCommand({
        TableName: this.env.get("DYNAMODB_INSTALLATION_TABLE"),
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
          ':id': { S: id },
        },
        Limit: 1,
      }),
    )

    if (!installation.Items) {
      return null
    }

    return InstallationMapper.toDomain(installation.Items[0])
  }

  async getAllInstallations(page: number, limit: number): Promise<Installation[]> {
    const dbInstallation = await this.createConnection()
    const installations = await dbInstallation.send(
      new ScanCommand({
        TableName: this.env.get("DYNAMODB_INSTALLATION_TABLE"),
        Limit: limit,
        ExclusiveStartKey:
          page > 1 ? { id: { S: page.toString() } } : undefined,
      }),
    )

    if (!installations.Items) {
      return []
    }

    return installations.Items.map((installation) => InstallationMapper.toDomain(installation))
  }
}
