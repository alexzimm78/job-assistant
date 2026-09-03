import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';

import {
    EmbeddingsService,
} from '../embeddings/embeddings.service';
import {
    VectorStorageService,
} from '../vector-storage/vector-storage.service';

import {
    ChatRequestDto,
} from './dto/chat-request.dto';
import {
    ChatResponseDto,
} from './dto/chat-response.dto';
import {
    ChatSearchResultDto,
} from './dto/chat-search-result.dto';

@Injectable()
export class ChatService {
    private readonly logger =
        new Logger(ChatService.name);

    private readonly topK: number = 5;

    constructor(
        private readonly embeddingsService:
        EmbeddingsService,
        private readonly vectorStorageService:
        VectorStorageService,
    ) {
    }

    async search(
        request: ChatRequestDto,
    ): Promise<ChatResponseDto> {
        const embeddings =
            await this.embeddingsService
                .createEmbeddings({
                    texts: [
                        request.message,
                    ],
                });

        const questionEmbedding =
            embeddings[0];

        if (!questionEmbedding) {
            throw new InternalServerErrorException(
                'Für die Frage wurde kein Embedding erstellt',
            );
        }

        const results =
            await this.vectorStorageService
                .searchSimilar(
                    questionEmbedding,
                    this.topK,
                );

        const chunks: ChatSearchResultDto[] =
            results.map(
                (
                    result,
                ): ChatSearchResultDto => {
                    const chunk =
                        result.payload
                            .chunkText ??
                        result.payload
                            .content ??
                        '';

                    return {
                        chunk: String(chunk),
                        score:
                        result.score,
                    };
                },
            );

        this.logger.log(
            `Frage: ${request.message}`,
        );

        chunks.forEach(
            (
                result,
                index,
            ) => {
                this.logger.log(
                    `Ergebnis ${index + 1}: ${result.chunk}`,
                );
            },
        );

        return {
            chunks,
        };
    }
}