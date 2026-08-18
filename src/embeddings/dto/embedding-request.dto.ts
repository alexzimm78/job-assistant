import { ApiProperty } from '@nestjs/swagger';

import {
    ArrayNotEmpty,
    IsArray,
    IsNotEmpty,
    IsString,
} from 'class-validator';

export class EmbeddingRequestDto {
    @ApiProperty({
        description:
            'Texte, für die Embeddings erstellt werden sollen',
        example: [
            'Was ist NestJS?',
            'Was ist TypeScript?',
            'Was ist PostgreSQL?',
        ],
        type: [String],
    })
    @IsArray()
    @ArrayNotEmpty()
    @IsString({
        each: true,
    })
    @IsNotEmpty({
        each: true,
    })
    texts: string[];
}