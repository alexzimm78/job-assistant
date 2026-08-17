import { ApiProperty } from '@nestjs/swagger';

import {
    IsNotEmpty,
    IsString,
    MaxLength,
} from 'class-validator';

export class AskAiRequestDto {
    @ApiProperty({
        example: 'Was ist NestJS?',
        description:
            'Nachricht, die an das KI-Modell gesendet wird',
        maxLength: 2000,
    })
    @IsString({
        message:
            'Die Nachricht muss eine Zeichenkette sein',
    })
    @IsNotEmpty({
        message:
            'Die Nachricht darf nicht leer sein',
    })
    @MaxLength(2000, {
        message:
            'Die Nachricht darf maximal 2000 Zeichen enthalten',
    })
    message: string;
}