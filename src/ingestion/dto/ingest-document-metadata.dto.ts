import {
    ApiProperty,
} from '@nestjs/swagger';

import {
    IsEnum,
} from 'class-validator';

import {
    DocumentLanguage,
} from '../enums/document-language.enum';
import {
    DocumentType,
} from '../enums/document-type.enum';

export class IngestDocumentMetadataDto {
    @ApiProperty({
        description: 'Art des hochgeladenen Dokuments',
        enum: DocumentType,
        example: DocumentType.JOB_OFFER,
    })
    @IsEnum(DocumentType)
    documentType: DocumentType;

    @ApiProperty({
        description: 'Sprache des hochgeladenen Dokuments',
        enum: DocumentLanguage,
        example: DocumentLanguage.DE,
    })
    @IsEnum(DocumentLanguage)
    language: DocumentLanguage;
}