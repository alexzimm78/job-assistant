import {
    Injectable,
    InternalServerErrorException,
    Logger,
} from '@nestjs/common';

import {
    AiService,
} from '../ai/ai.service';
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

@Injectable()
export class ChatService {
    private readonly logger =
        new Logger(ChatService.name);

    private readonly topK: number = 5;

    constructor(
        private readonly aiService:
        AiService,
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

        const chunks: string[] =
            results
                .map(
                    result => {
                        const chunk =
                            result.payload
                                .chunkText ??
                            result.payload
                                .content ??
                            '';

                        return typeof chunk ===
                        'string'
                            ? chunk
                            : '';
                    },
                )
                .filter(
                    chunk =>
                        chunk.trim()
                            .length > 0,
                );

        const context =
            chunks.length > 0
                ? chunks.join(
                    '\n\n',
                )
                : 'Keine relevanten Informationen gefunden.';

        const prompt = [
            'Du bist ein hilfreicher Assistent.',
            'Beantworte die Frage ausschließlich auf Grundlage des bereitgestellten Kontexts.',
            'Erfinde keine Informationen. Wenn der Kontext keine Antwort enthält, sage, dass die Information in der Wissensdatenbank nicht vorhanden ist.',
            'Gib nur die Antwort aus und erwähne den Kontext nicht.',
            '',
            'Kontext:',
            context,
            '',
            'Frage:',
            request.message,
        ].join('\n');

        this.logger.log(
            `Frage: ${request.message}`,
        );

        chunks.forEach(
            (
                chunk,
                index,
            ) => {
                this.logger.log(
                    `Ergebnis ${index + 1}: ${chunk}`,
                );
            },
        );

        const aiResponse =
            await this.aiService
                .ask({
                    message: prompt,
                });

        return {
            answer:
            aiResponse.answer,
        };
    }
}