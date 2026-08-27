import {
    Body,
    Controller,
    Post,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';

import {
    ApiBadGatewayResponse,
    ApiBadRequestResponse,
    ApiConsumes,
    ApiCreatedResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import { Public } from '../auth/decorators/public.decorator';

import { IngestDocumentRequestDto } from './dto/ingest-document-request.dto';
import { DocumentIngestionService } from './document-ingestion.service';
import { FileInterceptor } from '@nestjs/platform-express';



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
            'Dokument aufteilen und in Qdrant speichern',
    })
    @ApiCreatedResponse({
        description:
            'Das Dokument wurde in Chunks aufgeteilt und gespeichert',
        schema: {
            example: {
                saved: 3,
            },
        },
    })
    @ApiBadRequestResponse({
        description:
            'Der Text oder die Chunk-Einstellungen sind ungültig',
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
                .ingestDocument(dto);

        return {
            saved,
        };
    }

    // --------------------------------------------------
    // TXT-DATEI TESTWEISE EINLESEN
    // --------------------------------------------------

    @Public()
    @Post('file-test')
    @ApiOperation({
        summary:
            'TXT-Datei einlesen und Text zurückgeben',
    })
    @ApiCreatedResponse({
        description:
            'Der Text wurde erfolgreich aus der Datei gelesen',
    })
    @ApiBadRequestResponse({
        description:
            'Dateipfad oder Dateiformat ist ungültig',
    })
    async ingestFileTest(
        @Body('filePath')
        filePath: string,
    ): Promise<{
        saved: number;
    }> {
        const saved =
            await this.documentIngestionService
                .ingestFile(filePath);

        return {
            saved,
        };
    }

    // --------------------------------------------------
// DATEI DIREKT HOCHLADEN
// --------------------------------------------------

    @Public()
    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file'),
    )
    @ApiConsumes('multipart/form-data')
    @ApiOperation({
        summary:
            'TXT-, PDF- oder DOCX-Datei hochladen und in Qdrant speichern',
    })
    @ApiCreatedResponse({
        description:
            'Die Datei wurde verarbeitet und gespeichert',
        schema: {
            example: {
                saved: 2,
            },
        },
    })
    @ApiBadRequestResponse({
        description:
            'Datei fehlt oder Dateiformat ist ungültig',
    })
    async uploadFile(
        @UploadedFile()
        file: Express.Multer.File,
    ): Promise<{
        saved: number;
    }> {
        const saved =
            await this.documentIngestionService
                .ingestUploadedFile(file);

        return {
            saved,
        };
    }
}