import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';

import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
    imports: [
        UserModule,
    ],
    providers: [
        AuthService,
        AuthGuard,
        RolesGuard,
    ],
    exports: [
        AuthService,
        AuthGuard,
        RolesGuard,

    ],
})
export class AuthModule {}