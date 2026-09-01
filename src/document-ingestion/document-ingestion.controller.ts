import {
    BadRequestException,
    Body,
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';

import {
    ApiBadGatewayResponse,
    ApiBadRequestResponse,
    ApiBody,
    ApiConsumes,
    ApiCreatedResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import { Public } from '../auth/decorators/public.decorator';

import { DocumentIngestionService } from './document-ingestion.service';
import { IngestDocumentRequestDto } from './dto/ingest-document-request.dto';
import { UploadDocumentResponseDto } from './dto/upload-document-response.dto';

@ApiTags('document-ingestion')
@Controller('document-ingestion')
export class DocumentIngestionController {
    constructor(
        private readonly documentIngestionService:
        DocumentIngestionService,
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
            'Der übergebene Text ist ungültig',
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
            await this.documentIngestionService
                .ingestDocument(
                    dto,
                );

        return {
            saved,
        };
    }

    // --------------------------------------------------
    // TXT-DATEI DIREKT HOCHLADEN
    // --------------------------------------------------

    @Public()
    @Post('upload')
    @UseInterceptors(
        FileInterceptor(
            'file',
        ),
    )
    @ApiConsumes(
        'multipart/form-data',
    )
    @ApiBody({
        schema: {
            type: 'object',
            required: [
                'file',
            ],
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description:
                        'Es werden ausschließlich TXT-Dateien unterstützt',
                },
            },
        },
    })
    @ApiOperation({
        summary:
            'TXT-Datei hochladen und in Qdrant speichern',
    })
    @ApiCreatedResponse({
        description:
            'Die TXT-Datei wurde als ein Chunk gespeichert',
        type:
        UploadDocumentResponseDto,
    })
    @ApiBadRequestResponse({
        description:
            'Datei fehlt, ist leer oder besitzt kein TXT-Format',
    })
    @ApiBadGatewayResponse({
        description:
            'Fehler bei der Verbindung zum AI API oder zu Qdrant',
    })
    async uploadFile(
        @UploadedFile()
        file?: Express.Multer.File,
    ): Promise<UploadDocumentResponseDto> {
        if (!file) {
            throw new BadRequestException(
                'Bitte laden Sie eine TXT-Datei hoch.',
            );
        }

        const chunksCreated =
            await this.documentIngestionService
                .ingestUploadedFile(
                    file,
                );

        return {
            chunksCreated,
        };
    }
}