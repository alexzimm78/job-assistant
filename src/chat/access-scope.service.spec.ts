import {
    DocumentAccessLevel,
} from '../ingestion/enums/document-access-level.enum';
import {
    UserRole,
} from '../user/enums/user-role.enum';

import {
    AccessScopeService,
} from './access-scope.service';

describe(
    'AccessScopeService',
    () => {
        let service:
            AccessScopeService;

        beforeEach(
            () => {
                service =
                    new AccessScopeService();
            },
        );

        it(
            'soll CANDIDATE nur PUBLIC erlauben',
            () => {
                expect(
                    service.getAccessScope(
                        UserRole.CANDIDATE,
                    ),
                ).toEqual([
                    DocumentAccessLevel.PUBLIC,
                ]);
            },
        );

        it(
            'soll RECRUITER PUBLIC und INTERNAL erlauben',
            () => {
                expect(
                    service.getAccessScope(
                        UserRole.RECRUITER,
                    ),
                ).toEqual([
                    DocumentAccessLevel.PUBLIC,
                    DocumentAccessLevel.INTERNAL,
                ]);
            },
        );

        it(
            'soll ADMIN PUBLIC und INTERNAL erlauben',
            () => {
                expect(
                    service.getAccessScope(
                        UserRole.ADMIN,
                    ),
                ).toEqual([
                    DocumentAccessLevel.PUBLIC,
                    DocumentAccessLevel.INTERNAL,
                ]);
            },
        );
    },
);