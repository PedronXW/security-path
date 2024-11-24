import { DomainEvents } from '@/@shared/events/event-dispatcher'
import {
  EquipmentRepository
} from '@/domain/application/repositories/equipment-repository'
import { Equipment } from '@/domain/enterprise/entities/equipment'
import { EnvService } from '@/infra/env/env.service'
import {
  DeleteItemCommand,
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
  ScanCommand,
  UpdateItemCommand
} from '@aws-sdk/client-dynamodb'
import { EquipmentMapper } from '../mappers/equipment-mapper'

export class DynamoEquipmentRepository implements EquipmentRepository {

  constructor(private env: EnvService){}

  async createConnection(): Promise<DynamoDBClient> {
    const dbEquipment = new DynamoDBClient({
      region: this.env.get('DYNAMODB_REGION'),
      endpoint: this.env.get("DYNAMODB_ENDPOINT"),
      credentials: {
        accessKeyId: this.env.get("DYNAMODB_ACCESS_KEY"),
        secretAccessKey: this.env.get("DYNAMODB_SECRET_KEY"),
      },
    })
    return dbEquipment
  }

  async createEquipment(equipment: Equipment): Promise<Equipment> {

    const dbEquipment = await this.createConnection()

    await dbEquipment.send(
      new PutItemCommand({
        TableName: this.env.get("DYNAMODB_EQUIPMENT_TABLE"),
        Item: { ...EquipmentMapper.toPersistence(equipment) },
      }),
    )

    DomainEvents.markAggregateForDispatch(equipment)

    DomainEvents.dispatchEventsForAggregate(equipment.id)

    console.log('Equipment created')

    return equipment
  }

  async deleteEquipment(id: string): Promise<boolean> {
    const dbEquipment = await this.createConnection()
    const deleteResult = await dbEquipment.send(
      new DeleteItemCommand({
        TableName: this.env.get("DYNAMODB_EQUIPMENT_TABLE"),
        Key: { id: { S: id } },
      }),
    )

    return !!deleteResult
  }

  async editEquipment(id: string, equipment: Equipment): Promise<Equipment> {
    const dbEquipment = await this.createConnection()

    await dbEquipment.send(
      new UpdateItemCommand({
        TableName: this.env.get("DYNAMODB_EQUIPMENT_TABLE"),
        Key: { id: { S: id } },
        UpdateExpression: 'SET #n = :n, #l = :l, #d = :d, #c = :c',
        ExpressionAttributeValues: {
          ':n': { S: equipment.name },
          ':l': { S: equipment.label },
          ':d': { S: equipment.description },
          ':c': { S: equipment.credential },
        },
        ExpressionAttributeNames: {
          '#n': 'name',
          '#l': 'label',
          '#d': 'description',
          '#c': 'credential',
        },
        ReturnValues: 'ALL_NEW',
      }),
    )

    return EquipmentMapper.toDomain(equipment)
  }

  async getEquipmentByName(name: string): Promise<Equipment | null> {
    const dbEquipment = await this.createConnection()
    const equipment = await dbEquipment.send(
      new QueryCommand({
        TableName: this.env.get("DYNAMODB_EQUIPMENT_TABLE"),
        IndexName: 'name-index',
        KeyConditionExpression: 'name = :name',
        ExpressionAttributeValues: {
          ':name': { S: name },
        },
        Limit: 1,
      }),
    )

    if (!equipment.Items?.length) {
      return null
    }

    return EquipmentMapper.toDomain(equipment.Items[0])
  }

  async getEquipmentById(id: string): Promise<Equipment | null> {
    const dbEquipment = await this.createConnection()
    const equipment = await dbEquipment.send(
      new QueryCommand({
        TableName: this.env.get("DYNAMODB_EQUIPMENT_TABLE"),
        KeyConditionExpression: 'id = :id',
        ExpressionAttributeValues: {
          ':id': { S: id },
        },
        Limit: 1,
      }),
    )

    if (!equipment.Items) {
      return null
    }

    return EquipmentMapper.toDomain(equipment.Items[0])
  }

  async getAllEquipments(page: number, limit: number): Promise<Equipment[]> {
    const dbEquipment = await this.createConnection()
    const equipments = await dbEquipment.send(
      new ScanCommand({
        TableName: this.env.get("DYNAMODB_EQUIPMENT_TABLE"),
        Limit: limit,
        ExclusiveStartKey:
          page > 1 ? { id: { S: page.toString() } } : undefined,
      }),
    )

    if (!equipments.Items) {
      return []
    }

    return equipments.Items.map((equipment) => EquipmentMapper.toDomain(equipment))
  }
}
