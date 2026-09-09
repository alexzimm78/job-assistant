import {ApiProperty} from '@nestjs/swagger';

import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';
import {DocumentLanguage,} from '../../ingestion/enums/document-language.enum';
import {DocumentType,} from '../../ingestion/enums/document-type.enum';
import {DocumentAccessLevel,} from '../../ingestion/enums/document-access-level.enum';

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

    @ApiProperty({
        description:
            'Seitenzahl im ursprünglichen PDF-Dokument',
        example: 2,
        required: false,
    })
    @IsOptional()
    @IsInt()
    @Min(1)
    pageNumber?: number;

    @ApiProperty({
        description: 'Art des Dokuments',
        enum: DocumentType,
        example: DocumentType.JOB_OFFER,
        required: false,
    })
    @IsOptional()
    @IsEnum(DocumentType)
    documentType?: DocumentType;

    @ApiProperty({
        description: 'Sprache des Dokuments',
        enum: DocumentLanguage,
        example: DocumentLanguage.DE,
        required: false,
    })
    @IsOptional()
    @IsEnum(DocumentLanguage)
    language?: DocumentLanguage;

    @ApiProperty({
        description:
            'Zugriffsebene des Dokuments',
        enum:
        DocumentAccessLevel,
        example:
        DocumentAccessLevel.PUBLIC,
        required:
            false,
    })
    @IsOptional()
    @IsEnum(DocumentAccessLevel)
    accessLevel?: DocumentAccessLevel;
}