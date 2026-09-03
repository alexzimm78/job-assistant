import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class ChatRequestDto {
    @ApiProperty({
        description:
            'Frage des Benutzers für die semantische Suche',
        example:
            'Welche Kenntnisse braucht ein Backend-Entwickler?',
    })
    @IsString()
    @IsNotEmpty()
    message: string;
}