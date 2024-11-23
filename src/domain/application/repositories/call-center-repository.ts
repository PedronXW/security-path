import { CallCenter } from '@/domain/enterprise/entities/call-center'

export type EditCallCenter = {
  name?: string
  email?: string
}

export abstract class CallCenterRepository {
  abstract createCallCenter(callcenter: CallCenter): Promise<CallCenter>

  abstract deleteCallCenter(id: string): Promise<boolean>

  abstract editCallCenter(id: string, callcenter: EditCallCenter): Promise<CallCenter>

  abstract getCallCenterByName(name: string): Promise<CallCenter | null>

  abstract getCallCenterById(id: string): Promise<CallCenter | null>

  abstract getAllCallCenters(page: number, limit: number): Promise<CallCenter[]>
}
