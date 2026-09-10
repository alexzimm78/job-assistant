import {
    ApiProperty,
    ApiPropertyOptional,
} from '@nestjs/swagger';

import {
    IsEnum,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
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
            'Eindeutige ID des aktuellen Dialogs',
        example:
            '550e8400-e29b-41d4-a716-446655440000',
    })
    @IsUUID()
    conversationId: string;

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