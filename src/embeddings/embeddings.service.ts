import {
    Injectable,
    Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AiService } from '../ai/ai.service';

import { EmbeddingRequestDto } from './dto/embedding-request.dto';
import { GeminiEmbeddingRequestMapper } from './mapper/gemini-embedding-request.mapper';
import { GeminiEmbeddingResponseMapper } from './mapper/gemini-embedding-response.mapper';
import {
    Embedding,
    Embeddings,
} from './models/embedding.model';
import { GeminiEmbeddingRequest } from './models/gemini-embedding-request.model';
import { GeminiEmbeddingResponse } from './models/gemini-embedding-response.model';

@Injectable()
export class EmbeddingsService {
    private readonly logger =
        new Logger(EmbeddingsService.name);

    constructor(
        private readonly aiService: AiService,
        private readonly configService: ConfigService,
    ) {}

    async createEmbeddings(
        dto: EmbeddingRequestDto,
    ): Promise<Embeddings> {
        const model =
            this.configService.get<string>(
                'GEMINI_EMBEDDING_MODEL',
            ) ?? 'gemini-embedding-001';

        const requests: GeminiEmbeddingRequest[] =
            GeminiEmbeddingRequestMapper
                .toGeminiEmbeddingRequests(
                    dto,
                    model,
                );

        const embeddings: Embeddings = [];

        for (const request of requests) {
            const response: GeminiEmbeddingResponse =
                await this.aiService
                    .createEmbedding(request);

            const embedding: Embedding =
                GeminiEmbeddingResponseMapper
                    .toEmbedding(response);

            embeddings.push(embedding);
        }

        this.logger.log(
            `Embeddings erstellt: ${embeddings.length}`,
        );

        this.logger.log(
            `Embedding-Dimension: ${
                embeddings[0]?.length ?? 0
            }`,
        );

        return embeddings;
    }
}