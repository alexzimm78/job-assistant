import {
    IsEmail,
    IsNotEmpty,
    IsString,
    Matches,
    MinLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
    @ApiProperty({
        example: 'alexander',
        description: 'Loginname des Benutzers',
    })
    @IsString()
    @IsNotEmpty()
    login: string;

    @ApiProperty({
        example: 'alexander@example.com',
        description: 'E-Mail-Adresse des Benutzers',
    })
    @IsEmail({}, {
        message: 'Die E-Mail-Adresse ist ungültig',
    })
    email: string;

    @ApiProperty({
        example: 'Password123',
        description:
            'Passwort mit mindestens 8 Zeichen, einem Großbuchstaben und einer Zahl',
    })
    @IsString()
    @MinLength(8, {
        message: 'Das Passwort muss mindestens 8 Zeichen lang sein',
    })
    @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
        message:
            'Das Passwort muss mindestens einen Großbuchstaben und eine Zahl enthalten',
    })
    password: string;
}