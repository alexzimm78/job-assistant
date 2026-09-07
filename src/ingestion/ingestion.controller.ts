import {
    BadRequestException,
    Body,
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';

import {
    FileInterceptor,
} from '@nestjs/platform-express';

import {
    ApiBadGatewayResponse,
    ApiBadRequestResponse,
    ApiBody,
    ApiConsumes,
    ApiCreatedResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import {
    Public,
} from '../auth/decorators/public.decorator';

import {
    IngestDocumentMetadataDto,
} from './dto/ingest-document-metadata.dto';
import {
    IngestDocumentRequestDto,
} from './dto/ingest-document-request.dto';
import {
    UploadDocumentResponseDto,
} from './dto/upload-document-response.dto';
import {
    IngestionService,
} from './ingestion.service';

@ApiTags('ingestion')
@Controller('ingestion')
export class IngestionController {
    constructor(
        private readonly ingestionService:
        IngestionService,
    ) {}

    // --------------------------------------------------
    // TEXT DIREKT IN QDRANT SPEICHERN
    // --------------------------------------------------

    @Public()
    @Post()
    @ApiOperation({
        summary:
            'Text als ein Dokument in Qdrant speichern',
    })
    @ApiCreatedResponse({
        description:
            'Das Dokument wurde erfolgreich gespeichert',
        schema: {
            example: {
                saved: 1,
            },
        },
    })
    @ApiBadRequestResponse({
        description:
            'Der übergebene Text oder die Metadaten sind ungültig',
    })
    @ApiBadGatewayResponse({
        description:
            'Fehler bei der Verbindung zum AI API oder zu Qdrant',
    })
    async ingestDocument(
        @Body()
        dto: IngestDocumentRequestDto,
    ): Promise<{
        saved: number;
    }> {
        const saved =
            await this.ingestionService
                .ingestDocument(dto);

        return {
            saved,
        };
    }

    // --------------------------------------------------
    // TXT-, PDF- ODER DOCX-DATEI MIT METADATEN HOCHLADEN
    // --------------------------------------------------

    @Public()
    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file'),
    )
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: [
                'file',
                'documentType',
                'language',
            ],
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description:
                        'Unterstützte Formate: TXT, PDF und DOCX',
                },
                documentType: {
                    type: 'string',
                    enum: [
                        'RESUME',
                        'JOB_OFFER',
                        'COVER_LETTER',
                        'COMPANY_INFO',
                    ],
                    example:
                        'JOB_OFFER',
                    description:
                        'Art des hochgeladenen Dokuments',
                },
                language: {
                    type: 'string',
                    enum: [
                        'DE',
                        'EN',
                        'RU',
                    ],
                    example:
                        'DE',
                    description:
                        'Sprache des hochgeladenen Dokuments',
                },
            },
        },
    })
    @ApiOperation({
        summary:
            'TXT-, PDF- oder DOCX-Datei mit Metadaten hochladen',
    })
    @ApiCreatedResponse({
        description:
            'Die Datei wurde verarbeitet und als Chunks gespeichert',
        type:
        UploadDocumentResponseDto,
    })
    @ApiBadRequestResponse({
        description:
            'Datei fehlt, Metadaten sind ungültig oder das Dateiformat wird nicht unterstützt',
    })
    @ApiBadGatewayResponse({
        description:
            'Fehler bei der Verbindung zum AI API oder zu Qdrant',
    })
    async uploadFile(
        @UploadedFile()
        file:
            Express.Multer.File | undefined,

        @Body()
        metadata:
        IngestDocumentMetadataDto,
    ): Promise<UploadDocumentResponseDto> {
        if (!file) {
            throw new BadRequestException(
                'Bitte laden Sie eine TXT-, PDF- oder DOCX-Datei hoch.',
            );
        }

        const chunksCreated =
            await this.ingestionService
                .ingestUploadedFile(
                    file,
                    metadata,
                );

        return {
            chunksCreated,
        };
    }
}