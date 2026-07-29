import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { Request } from 'express';

import {
    IS_PUBLIC_KEY,
} from '../decorators/public.decorator';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { TokensService } from '../tokens.service';

export type AuthenticatedRequest = Request & {
    user?: TokenPayload;
};

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly tokensService: TokensService,
    ) {}

    canActivate(
        context: ExecutionContext,
    ): boolean {
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

        const accessToken =
            this.extractBearerToken(request);

        const payload =
            this.tokensService.verifyAccessToken(
                accessToken,
            );

        request.user = payload;

        return true;
    }

    private extractBearerToken(
        request: Request,
    ): string {
        const authorization =
            request.headers.authorization;

        if (!authorization) {
            throw new UnauthorizedException(
                'Access Token ist erforderlich',
            );
        }

        const [type, token] =
            authorization.split(' ');

        if (
            type !== 'Bearer' ||
            !token
        ) {
            throw new UnauthorizedException(
                'Bearer Access Token ist erforderlich',
            );
        }

        return token;
    }
}