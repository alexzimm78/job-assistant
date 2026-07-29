import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';

import { AuthService } from './auth.service';
import { AuthGuard } from './guards/auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { TokensService } from './tokens.service';
import { AuthController } from './auth.controller';

@Module({
    imports: [
        UserModule,
    ],

    controllers: [
        AuthController,
    ],

    providers: [
        AuthService,
        TokensService,
        AuthGuard,
        RolesGuard,
    ],

    exports: [
        AuthService,
        TokensService,
        AuthGuard,
        RolesGuard,
    ],


})
export class AuthModule {}