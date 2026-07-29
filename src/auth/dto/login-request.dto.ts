import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginRequestDto {
    @ApiProperty({
        example: 'alexander',
        description: 'Login des Benutzers',
    })
    @IsString()
    @IsNotEmpty()
    login: string;

    @ApiProperty({
        example: 'Password123!',
        description: 'Passwort des Benutzers',
        minLength: 6,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}