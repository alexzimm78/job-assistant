import { ApiProperty } from '@nestjs/swagger';

import { UserRole } from '../enums/user-role.enum';

export class UserResponseDto {
    @ApiProperty({
        example: 1,
        description: 'ID des Benutzers',
    })
    id: number;

    @ApiProperty({
        example: 'alex',
        description: 'Login des Benutzers',
    })
    login: string;

    @ApiProperty({
        enum: UserRole,
        example: UserRole.CANDIDATE,
        description: 'Rolle des Benutzers',
    })
    role: UserRole;
}