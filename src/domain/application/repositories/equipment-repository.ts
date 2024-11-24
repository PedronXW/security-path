import { Equipment } from '@/domain/enterprise/entities/equipment';


export abstract class EquipmentRepository {
  abstract createEquipment(equipment: Equipment): Promise<Equipment>

  abstract deleteEquipment(id: string): Promise<boolean>

  abstract editEquipment(id: string, equipment: Equipment): Promise<Equipment>

  abstract getEquipmentByName(name: string): Promise<Equipment | null>

  abstract getEquipmentById(id: string): Promise<Equipment | null>

  abstract getAllEquipments(page: number, limit: number): Promise<Equipment[]>
}
