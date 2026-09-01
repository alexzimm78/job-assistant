import { ApiProperty } from '@nestjs/swagger';

import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Min,
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

    @ApiProperty({
        description:
            'Position des Chunks im ursprünglichen Dokument',
        example: 0,
        required: false,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    chunkIndex?: number;

    @ApiProperty({
        description:
            'Name des ursprünglichen Dokuments',
        example: 'bewerbung.txt',
        required: false,
    })
    @IsOptional()
    @IsString()
    documentName?: string;

    @ApiProperty({
        description:
            'Textinhalt des einzelnen Chunks',
        example:
            'Dies ist der erste Abschnitt des Dokuments.',
        required: false,
    })
    @IsOptional()
    @IsString()
    chunkText?: string;
}