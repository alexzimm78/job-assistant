import {
    ApiProperty,
} from '@nestjs/swagger';

import {
    Type,
} from 'class-transformer';

import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsString,
    Min,
} from 'class-validator';

import {
    DocumentAccessLevel,
} from '../enums/document-access-level.enum';
import {
    DocumentLanguage,
} from '../enums/document-language.enum';
import {
    DocumentType,
} from '../enums/document-type.enum';

export class IngestDocumentMetadataDto {
    @ApiProperty({
        description:
            'Permanente ID des logischen Dokuments',
        example:
            'DOC-001',
    })
    @IsString()
    @IsNotEmpty()
    documentId: string;

    @ApiProperty({
        description:
            'Version des Dokuments',
        example:
            1,
        minimum:
            1,
    })
    @Type(() => Number)
    @IsInt()
    @Min(1)
    documentVersion: number;

    @ApiProperty({
        description:
            'Art des hochgeladenen Dokuments',
        enum:
        DocumentType,
        example:
        DocumentType.JOB_OFFER,
    })
    @IsEnum(DocumentType)
    documentType: DocumentType;

    @ApiProperty({
        description:
            'Sprache des hochgeladenen Dokuments',
        enum:
        DocumentLanguage,
        example:
        DocumentLanguage.DE,
    })
    @IsEnum(DocumentLanguage)
    language: DocumentLanguage;

    @ApiProperty({
        description:
            'Zugriffsebene des hochgeladenen Dokuments',
        enum:
        DocumentAccessLevel,
        example:
        DocumentAccessLevel.PUBLIC,
    })
    @IsEnum(DocumentAccessLevel)
    accessLevel: DocumentAccessLevel;
}