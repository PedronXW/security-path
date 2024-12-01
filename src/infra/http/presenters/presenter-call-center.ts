import { CallCenter } from '@/domain/enterprise/entities/call-center'

export type CallCenterHTTP = {
  id: string
  name: string
  description: string
  label: string
  createdAt: Date
  updatedAt: Date
}

export class CallCenterPresenter {
  static toHTTP(callcenter: CallCenter): CallCenterHTTP {
    return {
      id: callcenter.id.getValue(),
      name: callcenter.name,
      description: callcenter.description,
      createdAt: callcenter.createdAt,
      label: callcenter.label,
      updatedAt: callcenter.updatedAt,
    }
  }
}
