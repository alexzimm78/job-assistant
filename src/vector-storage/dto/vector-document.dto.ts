import { ApiProperty } from '@nestjs/swagger';

import {
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

export class VectorDocumentDto {
    @ApiProperty({
        description: 'Titel des Dokuments',
        example: 'NestJS',
    })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        description:
            'Text, für den ein Embedding erstellt wird',
        example:
            'NestJS ist ein Framework für Node.js-Anwendungen.',
    })
    @IsString()
    @IsNotEmpty()
    content: string;

    @ApiProperty({
        description: 'Kategorie des Dokuments',
        example: 'programming',
        required: false,
    })
    @IsOptional()
    @IsString()
    category?: string;

    @ApiProperty({
        description: 'Quelle des Dokuments',
        example: 'AI Job Assistant',
        required: false,
    })
    @IsOptional()
    @IsString()
    source?: string;
}