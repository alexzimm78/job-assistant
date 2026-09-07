import {ApiProperty} from '@nestjs/swagger';

import {IsNotEmpty, IsString} from 'class-validator';
import {IngestDocumentMetadataDto,} from './ingest-document-metadata.dto';

export class IngestDocumentRequestDto
    extends IngestDocumentMetadataDto {
    @ApiProperty({
        description: 'Name des Dokuments',
        example: 'document.txt',
    })
    @IsString()
    @IsNotEmpty()
    fileName: string;

    @ApiProperty({
        description: 'Vollständiger Text des Dokuments',
        example: 'NestJS ist ein Framework für serverseitige Anwendungen.',
    })
    @IsString()
    @IsNotEmpty()
    text: string;
}
