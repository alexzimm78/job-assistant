import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { EmailModule } from '../email/email.module';
import { EmailConfirmation } from './email-confirmation.entity';
import { RegistrationService} from "./registration.service";
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserService } from './user.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            EmailConfirmation,
        ]),
        EmailModule,
    ],
    controllers: [
        UserController,
    ],
    providers: [
        UserService,
        RegistrationService,
    ],
    exports: [
        UserService,
    ],
})
export class UserModule {}