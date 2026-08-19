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

import { SaveVectorDocumentsRequestDto } from './dto/save-vector-documents-request.dto';
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
}