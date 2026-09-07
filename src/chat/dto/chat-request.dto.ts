import {
    ApiProperty,
    ApiPropertyOptional,
} from '@nestjs/swagger';

import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
} from 'class-validator';

import {
    DocumentLanguage,
} from '../../ingestion/enums/document-language.enum';
import {
    DocumentType,
} from '../../ingestion/enums/document-type.enum';

export class ChatRequestDto {
    @ApiProperty({
        description:
            'Frage des Benutzers für die semantische Suche',
        example:
            'Welche Kenntnisse benötigt ein Backend-Entwickler?',
    })
    @IsString()
    @IsNotEmpty()
    message: string;

    @ApiPropertyOptional({
        description:
            'Optionaler Filter nach Dokumentart',
        enum:
        DocumentType,
        example:
        DocumentType.JOB_OFFER,
    })
    @IsOptional()
    @IsEnum(DocumentType)
    documentType?: DocumentType;

    @ApiPropertyOptional({
        description:
            'Optionaler Filter nach Dokumentsprache',
        enum:
        DocumentLanguage,
        example:
        DocumentLanguage.DE,
    })
    @IsOptional()
    @IsEnum(DocumentLanguage)
    language?: DocumentLanguage;
}