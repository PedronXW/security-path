import { CallCenterRepository } from '@/domain/application/repositories/call-center-repository';
import { ClientRepository } from '@/domain/application/repositories/client-repository';
import { EquipmentRepository } from '@/domain/application/repositories/equipment-repository';
import { InstallationRepository } from '@/domain/application/repositories/installation-repository';
import { ObserverRepository } from '@/domain/application/repositories/observer-repository';
import { Module } from '@nestjs/common';
import { DynamoCallCenterRepository } from './repositories/DynamoCallCenterRepository';
import { DynamoClientRepository } from './repositories/DynamoClientRepository';
import { DynamoEquipmentRepository } from './repositories/DynamoEquipmentRepository';
import { DynamoInstallationRepository } from './repositories/DynamoInstallationRepository';
import { DynamoObserverRepository } from './repositories/DynamoObserverRepository';

@Module({
    imports: [],
    controllers: [],
    providers: [
        {
            provide: ClientRepository,
            useClass: DynamoClientRepository
        },
        {
            provide: CallCenterRepository,
            useClass: DynamoCallCenterRepository
        },
        {
            provide: EquipmentRepository,
            useClass: DynamoEquipmentRepository
        },
        {
            provide: InstallationRepository,
            useClass: DynamoInstallationRepository
        },
        {
            provide: ObserverRepository,
            useClass: DynamoObserverRepository
        }
    ],
    exports: [ClientRepository, CallCenterRepository, EquipmentRepository, InstallationRepository, ObserverRepository],
})
export class DatabaseModule {}
