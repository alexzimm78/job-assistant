import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';

import { Reflector } from '@nestjs/core';

import { Request } from 'express';

import { UserRole } from '../../user/enums/user-role.enum';

import {
    ROLES_KEY,
} from '../decorators/roles.decorator';
import { TokenPayload } from '../interfaces/token-payload.interface';

type AuthenticatedRequest = Request & {
    user?: TokenPayload;
};

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
    ) {}

    canActivate(
        context: ExecutionContext,
    ): boolean {
        const requiredRoles =
            this.reflector.getAllAndOverride<UserRole[]>(
                ROLES_KEY,
                [
                    context.getHandler(),
                    context.getClass(),
                ],
            );

        if (!requiredRoles?.length) {
            return true;
        }

        const request =
            context
                .switchToHttp()
                .getRequest<AuthenticatedRequest>();

        const user = request.user;

        if (
            !user ||
            !requiredRoles.includes(user.role)
        ) {
            throw new ForbiddenException(
                'Sie haben keine Berechtigung für diese Aktion',
            );
        }

        return true;
    }
}