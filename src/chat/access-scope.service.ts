import {
    ForbiddenException,
    Injectable,
} from '@nestjs/common';

import {
    DocumentAccessLevel,
} from '../ingestion/enums/document-access-level.enum';
import {
    UserRole,
} from '../user/enums/user-role.enum';

@Injectable()
export class AccessScopeService {
    getAccessScope(
        userRole: UserRole,
    ): DocumentAccessLevel[] {
        switch (userRole) {
            case UserRole.CANDIDATE:
                return [
                    DocumentAccessLevel.PUBLIC,
                ];

            case UserRole.RECRUITER:
            case UserRole.ADMIN:
                return [
                    DocumentAccessLevel.PUBLIC,
                    DocumentAccessLevel.INTERNAL,
                ];

            default:
                throw new ForbiddenException(
                    'Für diese Benutzerrolle ist kein Dokumentzugriff definiert',
                );
        }
    }
}