import { ApiProperty } from '@nestjs/swagger';

import {
    IsEnum,
    IsNotEmpty,
    IsString,
    MinLength,
} from 'class-validator';

import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
    @ApiProperty({
        example: 'alex',
        description: 'Login des Benutzers',
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    login: string;

    @ApiProperty({
        example: 'secret123',
        description: 'Passwort mit mindestens 6 Zeichen',
        minLength: 6,
    })
    @IsString()
    @MinLength(6)
    password: string;

    @ApiProperty({
        enum: UserRole,
        example: UserRole.CANDIDATE,
        description: 'Rolle des Benutzers',
    })
    @IsEnum(UserRole)
    role: UserRole;
}