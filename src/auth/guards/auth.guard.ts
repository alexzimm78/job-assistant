import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { Request } from 'express';

import { User } from '../../user/user.entity';
import { AuthService } from '../auth.service';
import {
    IS_PUBLIC_KEY,
} from '../decorators/public.decorator';

type AuthenticatedRequest = Request & {
    user?: User;
};

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly authService: AuthService,
    ) {}

    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        const isPublic =
            this.reflector.getAllAndOverride<boolean>(
                IS_PUBLIC_KEY,
                [
                    context.getHandler(),
                    context.getClass(),
                ],
            );

        if (isPublic) {
            return true;
        }

        const request =
            context
                .switchToHttp()
                .getRequest<AuthenticatedRequest>();

        const authorization =
            request.headers.authorization;

        if (
            !authorization ||
            !authorization.startsWith('Basic ')
        ) {
            throw new UnauthorizedException(
                'Basic Authentication ist erforderlich',
            );
        }

        const encodedCredentials =
            authorization
                .slice('Basic '.length)
                .trim();

        const decodedCredentials =
            Buffer.from(
                encodedCredentials,
                'base64',
            ).toString('utf8');

        const separatorIndex =
            decodedCredentials.indexOf(':');

        if (separatorIndex < 1) {
            throw new UnauthorizedException(
                'Ungültige Basic-Authentication-Daten',
            );
        }

        const login =
            decodedCredentials.slice(
                0,
                separatorIndex,
            );

        const password =
            decodedCredentials.slice(
                separatorIndex + 1,
            );

        if (!password) {
            throw new UnauthorizedException(
                'Login und Passwort sind erforderlich',
            );
        }

        const user =
            await this.authService.authenticate(
                login,
                password,
            );

        request.user = user;

        return true;
    }
}