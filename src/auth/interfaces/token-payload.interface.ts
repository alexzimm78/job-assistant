import { UserRole } from '../../user/enums/user-role.enum';

export interface TokenPayload {
    sub: number;
    login: string;
    role: UserRole;
}
