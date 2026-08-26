import {
    ApiProperty,
    ApiPropertyOptional,
} from '@nestjs/swagger';

import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Max,
    Min,
} from 'class-validator';

export class IngestDocumentRequestDto {
    @ApiProperty({
        description: 'Name des Dokuments',
        example: 'customer-request.txt',
    })
    @IsString()
    @IsNotEmpty()
    fileName: string;

    @ApiProperty({
        description:
            'Vollständiger Text des Dokuments',
        example:
            'Wir suchen einen Backend-Entwickler mit Erfahrung in NestJS, TypeScript und PostgreSQL.',
    })
    @IsString()
    @IsNotEmpty()
    text: string;

    @ApiPropertyOptional({
        description:
            'Maximale Anzahl der Zeichen pro Chunk',
        example: 1000,
        default: 1000,
        minimum: 100,
        maximum: 5000,
    })
    @IsOptional()
    @IsInt()
    @Min(100)
    @Max(5000)
    chunkSize?: number;

    @ApiPropertyOptional({
        description:
            'Anzahl überlappender Zeichen zwischen zwei Chunks',
        example: 200,
        default: 200,
        minimum: 0,
        maximum: 1000,
    })
    @IsOptional()
    @IsInt()
    @Min(0)
    @Max(1000)
    chunkOverlap?: number;
}