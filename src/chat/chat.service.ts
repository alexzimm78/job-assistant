import {
    Injectable,
    InternalServerErrorException,

} from '@nestjs/common';

import {
    AiService,
} from '../ai/ai.service';
import {
    EmbeddingsService,
} from '../embeddings/embeddings.service';
import {
    UserRole,
} from '../user/enums/user-role.enum';
import {
    SearchFilterBuilder,
} from '../vector-storage/qdrant/search-filter.builder';
import {
    VectorStorageService,
} from '../vector-storage/vector-storage.service';

import {
    AccessScopeService,
} from './access-scope.service';
import {
    ChatHistoryService,
} from './chat-history.service';
import {
    ChatRequestDto,
} from './dto/chat-request.dto';
import {
    ChatResponseDto,
    ChatSourceDto,
} from './dto/chat-response.dto';
import {
    PromptService,
} from './prompt.service';

@Injectable()
export class ChatService {


    private readonly topK: number = 5;

    constructor(
        private readonly accessScopeService:
        AccessScopeService,
        private readonly aiService:
        AiService,
        private readonly chatHistoryService:
        ChatHistoryService,
        private readonly embeddingsService:
        EmbeddingsService,
        private readonly promptService:
        PromptService,
        private readonly vectorStorageService:
        VectorStorageService,
    ) {
    }

    async search(
        request: ChatRequestDto,
        userId: number,
        userRole: UserRole,
    ): Promise<ChatResponseDto> {
        const history =
            this.chatHistoryService
                .getHistory(
                    userId,
                    request.conversationId,
                );

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

        const allowedAccessLevels =
            this.accessScopeService
                .getAccessScope(
                    userRole,
                );

        const filter =
            SearchFilterBuilder.build(
                request.documentType,
                request.language,
                allowedAccessLevels,
            );

        const results =
            await this.vectorStorageService
                .searchSimilar(
                    questionEmbedding,
                    this.topK,
                    filter,
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

        const sources: ChatSourceDto[] =
            results
                .map(
                    result => {
                        const documentName =
                            result.payload
                                .documentName ??
                            result.payload
                                .source;

                        const pageNumber =
                            result.payload
                                .pageNumber;

                        if (
                            typeof documentName !==
                            'string'
                        ) {
                            return undefined;
                        }

                        return {
                            documentName,
                            ...(typeof pageNumber ===
                            'number'
                                ? {
                                    pageNumber,
                                }
                                : {}),
                        };
                    },
                )
                .filter(
                    (
                        source,
                    ): source is ChatSourceDto =>
                        source !== undefined,
                )
                .filter(
                    (
                        source,
                        index,
                        allSources,
                    ) =>
                        allSources.findIndex(
                            item =>
                                item.documentName ===
                                source.documentName &&
                                item.pageNumber ===
                                source.pageNumber,
                        ) === index,
                );

        const prompt =
            this.promptService
                .buildPromptForChat()
                .withUserRole(
                    userRole,
                )
                .withContext(
                    chunks,
                )
                .withChatHistory(
                    history,
                )
                .withQuestion(
                    request.message,
                )
                .build();


        const aiResponse =
            await this.aiService
                .ask({
                    message: prompt,
                });

        this.chatHistoryService
            .addMessage(
                userId,
                request.conversationId,
                request.message,
                aiResponse.answer,
            );

        return {
            answer:
            aiResponse.answer,
            sources,
        };
    }
}