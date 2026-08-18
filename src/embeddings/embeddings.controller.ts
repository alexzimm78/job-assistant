import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
} from '@nestjs/common';

import {
    ApiBadRequestResponse,
    ApiNoContentResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import { Public } from '../auth/decorators/public.decorator';

import { EmbeddingRequestDto } from './dto/embedding-request.dto';
import { EmbeddingsService } from './embeddings.service';

@ApiTags('embeddings')
@Controller('embeddings')
export class EmbeddingsController {
    constructor(
        private readonly embeddingsService:
        EmbeddingsService,
    ) {}
    @Public()
    @Post()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary:
            'Embeddings für mehrere Texte erstellen',
    })
    @ApiNoContentResponse({
        description:
            'Embeddings wurden erfolgreich erstellt',
    })
    @ApiBadRequestResponse({
        description:
            'Die übergebenen Texte sind ungültig',
    })
    async createEmbeddings(
        @Body() dto: EmbeddingRequestDto,
    ): Promise<void> {
        await this.embeddingsService
            .createEmbeddings(dto);
    }
}