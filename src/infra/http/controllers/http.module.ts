import { AuthenticateClientService } from '@/domain/application/services/client/authenticate';
import { ChangePasswordService } from '@/domain/application/services/client/change-password';
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
import { CryptographyModule } from '@/infra/cryptography/cryptograpy.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { EnvModule } from '@/infra/env/env.module';
import { Module } from '@nestjs/common';
import { AuthenticateController } from './client/authentication';
import { ChangePasswordController } from './client/change-password';
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
    AuthenticateController,
    ChangePasswordController,
    FindClientByIdController,
    ResetPasswordController,
    SendResetPasswordController,
    FetchAllClientsController,
    FindClientByEmailController,
    SendVerificationClientEmailController,
    VerifyClientEmailController
  ],
  providers: [
    CreateClientService,
    DeleteClientService,
    EditClientService,
    AuthenticateClientService,
    ChangePasswordService,
    FindClientByEmailService,
    FindClientByIdService,
    FetchAllClientsService,
    SendVerificationClientEmailService,
    SendResetPasswordService,
    VerifyClientEmailService,
    ResetClientPasswordService,
  ],
})
export class HttpModule {}
