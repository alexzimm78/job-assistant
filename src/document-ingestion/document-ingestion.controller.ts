import {
    Body,
    Controller,
    Post,
} from '@nestjs/common';

import {
    ApiBadGatewayResponse,
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import { Public } from '../auth/decorators/public.decorator';

import { IngestDocumentRequestDto } from './dto/ingest-document-request.dto';
import { DocumentIngestionService } from './document-ingestion.service';

@ApiTags('document-ingestion')
@Controller('document-ingestion')
export class DocumentIngestionController {
    constructor(
        private readonly documentIngestionService:
        DocumentIngestionService,
    ) {}

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
}