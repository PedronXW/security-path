import { CreateCallCenterService } from '@/domain/application/services/call-center/create';
import { DeleteCallCenterService } from '@/domain/application/services/call-center/delete';
import { EditCallCenterService } from '@/domain/application/services/call-center/edit';
import { FetchAllCallCentersService } from '@/domain/application/services/call-center/fetch-all';
import { FindCallCenterByIdService } from '@/domain/application/services/call-center/find-by-id';
import { FindCallCenterByNameService } from '@/domain/application/services/call-center/find-by-name';
import { AuthenticateClientService } from '@/domain/application/services/client/authenticate';
import { ChangeClientPasswordService } from '@/domain/application/services/client/change-password';
import { CreateClientService } from '@/domain/application/services/client/create';
import { DeleteClientService } from '@/domain/application/services/client/delete';
import { EditClientService } from '@/domain/application/services/client/edit';
import { FetchAllClientsService } from '@/domain/application/services/client/fetch-all';
import { FindClientByEmailService } from '@/domain/application/services/client/find-by-email';
import { FindClientByIdService } from '@/domain/application/services/client/find-by-id';
import { ResetClientPasswordService } from '@/domain/application/services/client/reset-password';
import { SendResetPasswordService } from '@/domain/application/services/client/send-reset-password';
import { SendVerificationClientEmailService } from '@/domain/application/services/client/send-verification-email';
import { VerifyClientEmailService } from '@/domain/application/services/client/verify-email';
import { CreateEquipmentService } from '@/domain/application/services/equipment/create';
import { DeleteEquipmentService } from '@/domain/application/services/equipment/delete';
import { EditEquipmentService } from '@/domain/application/services/equipment/edit';
import { FetchAllEquipmentsService } from '@/domain/application/services/equipment/fetch-all';
import { FindEquipmentByIdService } from '@/domain/application/services/equipment/find-by-id';
import { FindEquipmentByNameService } from '@/domain/application/services/equipment/find-by-name';
import { CreateInstallationService } from '@/domain/application/services/installation/create';
import { DeleteInstallationService } from '@/domain/application/services/installation/delete';
import { EditInstallationService } from '@/domain/application/services/installation/edit';
import { FetchAllInstallationsService } from '@/domain/application/services/installation/fetch-all';
import { FindInstallationByIdService } from '@/domain/application/services/installation/find-by-id';
import { FindInstallationByNameService } from '@/domain/application/services/installation/find-by-name';
import { AuthenticateObserverService } from '@/domain/application/services/observer/authenticate';
import { ChangeObserverPasswordService } from '@/domain/application/services/observer/change-password';
import { CreateObserverService } from '@/domain/application/services/observer/create';
import { DeleteObserverService } from '@/domain/application/services/observer/delete';
import { EditObserverService } from '@/domain/application/services/observer/edit';
import { FetchAllObserversService } from '@/domain/application/services/observer/fetch-all';
import { FindObserverByIdService } from '@/domain/application/services/observer/find-by-id';
import { FindObserverByNameService } from '@/domain/application/services/observer/find-by-name';
import { CryptographyModule } from '@/infra/cryptography/cryptograpy.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { EnvModule } from '@/infra/env/env.module';
import { Module } from '@nestjs/common';
import { CreateCallCenterController } from './call-center/create';
import { DeleteCallCenterController } from './call-center/delete';
import { EditCallCenterController } from './call-center/edit';
import { FetchAllCallCentersController } from './call-center/fetch-all';
import { FindCallCenterByIdController } from './call-center/find-by-id';
import { FindCallCenterByNameController } from './call-center/find-by-name';
import { AuthenticateClientController } from './client/authentication';
import { ChangeClientPasswordController } from './client/change-password';
import { CreateClientController } from './client/create';
import { DeleteClientController } from './client/delete';
import { EditClientController } from './client/edit';
import { FetchAllClientsController } from './client/fetch-all';
import { FindClientByEmailController } from './client/find-by-email';
import { FindClientByIdController } from './client/find-by-id';
import { ResetPasswordController } from './client/reset-password';
import { SendResetPasswordController } from './client/send-reset-password';
import { SendVerificationClientEmailController } from './client/send-verification-email';
import { VerifyClientEmailController } from './client/verify-email';
import { CreateEquipmentController } from './equipment/create';
import { DeleteEquipmentController } from './equipment/delete';
import { EditEquipmentController } from './equipment/edit';
import { FetchAllEquipmentsController } from './equipment/fetch-all';
import { FindEquipmentByIdController } from './equipment/find-by-id';
import { FindEquipmentByNameController } from './equipment/find-by-name';
import { CreateInstallationController } from './installation/create';
import { DeleteInstallationController } from './installation/delete';
import { EditInstallationController } from './installation/edit';
import { FetchAllInstallationsController } from './installation/fetch-all';
import { FindInstallationByIdController } from './installation/find-by-id';
import { FindInstallationByNameController } from './installation/find-by-name';
import { AuthenticateObserverController } from './observer/authentication';
import { ChangeObserverPasswordController } from './observer/change-password';
import { CreateObserverController } from './observer/create';
import { DeleteObserverController } from './observer/delete';
import { EditObserverController } from './observer/edit';
import { FetchAllObserversController } from './observer/fetch-all';
import { FindObserverByIdController } from './observer/find-by-id';
import { FindObserverByNameController } from './observer/find-by-name';

@Module({
  imports: [
    CryptographyModule,
    EnvModule,
    DatabaseModule
  ],
  controllers: [
    CreateClientController,
    EditClientController,
    DeleteClientController,
    AuthenticateClientController,
    ChangeClientPasswordController,
    FindClientByIdController,
    ResetPasswordController,
    SendResetPasswordController,
    FetchAllClientsController,
    FindClientByEmailController,
    SendVerificationClientEmailController,
    VerifyClientEmailController,
    CreateObserverController,
    EditObserverController,
    DeleteObserverController,
    AuthenticateObserverController,
    ChangeObserverPasswordController,
    FindObserverByIdController,
    FetchAllObserversController,
    FindObserverByNameController,
    CreateCallCenterController,
    EditCallCenterController,
    DeleteCallCenterController,
    FindCallCenterByIdController,
    FetchAllCallCentersController,
    FindCallCenterByNameController,
    CreateEquipmentController,
    EditEquipmentController,
    DeleteEquipmentController,
    FindEquipmentByIdController,
    FetchAllEquipmentsController,
    FindEquipmentByNameController,
    CreateInstallationController,
    EditInstallationController,
    DeleteInstallationController,
    FindInstallationByIdController,
    FetchAllInstallationsController,
    FindInstallationByNameController,
  ],
  providers: [
    CreateClientService,
    DeleteClientService,
    EditClientService,
    AuthenticateClientService,
    ChangeClientPasswordService,
    FindClientByEmailService,
    FindClientByIdService,
    FetchAllClientsService,
    SendVerificationClientEmailService,
    SendResetPasswordService,
    VerifyClientEmailService,
    ResetClientPasswordService,
    CreateObserverService,
    DeleteObserverService,
    EditObserverService,
    AuthenticateObserverService,
    ChangeObserverPasswordService,
    FindObserverByIdService,
    FetchAllObserversService,
    FindObserverByNameService,
    CreateCallCenterService,
    DeleteCallCenterService,
    EditCallCenterService,
    FindCallCenterByIdService,
    FetchAllCallCentersService,
    FindCallCenterByNameService,
    CreateEquipmentService,
    DeleteEquipmentService,
    EditEquipmentService,
    FindEquipmentByIdService,
    FetchAllEquipmentsService,
    FindEquipmentByNameService,
    CreateInstallationService,
    DeleteInstallationService,
    EditInstallationService,
    FindInstallationByIdService,
    FetchAllInstallationsService,
    FindInstallationByNameService
  ],
})
export class HttpModule {}
