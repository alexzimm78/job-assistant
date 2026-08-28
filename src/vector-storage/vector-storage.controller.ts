import {
    Body,
    Controller,
    Post,
} from '@nestjs/common';

import {
    ApiBadGatewayResponse,
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import { Public } from '../auth/decorators/public.decorator';

import { SaveVectorDocumentsRequestDto } from './dto/save-vector-documents-request.dto';
import { SearchVectorDocumentsRequestDto } from './dto/search-vector-documents-request.dto';
import { QdrantSearchResult } from './qdrant/models/qdrant-search-result.model';
import { VectorStorageService } from './vector-storage.service';

@ApiTags('vector-storage')
@Controller('vector-storage')
export class VectorStorageController {
    constructor(
        private readonly vectorStorageService:
        VectorStorageService,
    ) {}

    @Public()
    @Post()
    @ApiOperation({
        summary:
            'Dokumente mit Embeddings in Qdrant speichern',
    })
    @ApiCreatedResponse({
        description:
            'Dokumente wurden erfolgreich gespeichert',
        schema: {
            example: {
                saved: 2,
            },
        },
    })
    @ApiBadRequestResponse({
        description:
            'Die übergebenen Dokumente sind ungültig',
    })
    @ApiBadGatewayResponse({
        description:
            'Fehler bei der Verbindung zum AI API oder zu Qdrant',
    })
    async saveDocuments(
        @Body()
        dto: SaveVectorDocumentsRequestDto,
    ): Promise<{
        saved: number;
    }> {
        const saved =
            await this.vectorStorageService
                .saveDocuments(dto);

        return {
            saved,
        };
    }

    @Public()
    @Post('search')
    @ApiOperation({
        summary:
            'Dokumente in Qdrant semantisch durchsuchen',
    })
    @ApiOkResponse({
        description:
            'Die ähnlichsten Dokumente wurden gefunden',
        schema: {
            example: [
                {
                    id: '9e0c6dc5-1f66-4d4f-9d05-2fb882d1de25',
                    score: 0.87,
                    payload: {
                        title: 'lebenslauf.pdf – Teil 2',
                        content:
                            'Erfahrung mit NestJS und PostgreSQL',
                        category: 'document-chunk',
                        source: 'lebenslauf.pdf',
                    },
                },
            ],
        },
    })
    @ApiBadRequestResponse({
        description:
            'Suchtext oder Limit ist ungültig',
    })
    @ApiBadGatewayResponse({
        description:
            'Fehler bei der Verbindung zum AI API oder zu Qdrant',
    })
    async searchDocuments(
        @Body()
        dto: SearchVectorDocumentsRequestDto,
    ): Promise<QdrantSearchResult[]> {
        return this.vectorStorageService
            .searchDocuments(dto);
    }
}
