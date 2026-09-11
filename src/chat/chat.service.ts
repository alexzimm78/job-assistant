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
    ContextService,
} from './context.service';

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
    private readonly topK:
        number = 5;

    constructor(
        private readonly accessScopeService:
        AccessScopeService,

        private readonly aiService:
        AiService,

        private readonly chatHistoryService:
        ChatHistoryService,

        private readonly contextService:
        ContextService,

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

        const preparedFragments =
            this.contextService
                .generateContext(
                    results,
                );

        const preparedContext:
            string[] =
            preparedFragments.map(
                fragment =>
                    fragment.content,
            );

        const sources:
            ChatSourceDto[] = [];

        for (
            const fragment
            of preparedFragments
            ) {
            if (
                fragment.pageNumbers
                    .length === 0
            ) {
                sources.push({
                    documentName:
                    fragment.documentName,
                });

                continue;
            }

            for (
                const pageNumber
                of fragment.pageNumbers
                ) {
                const sourceExists =
                    sources.some(
                        source =>
                            source.documentName ===
                            fragment.documentName &&
                            source.pageNumber ===
                            pageNumber,
                    );

                if (!sourceExists) {
                    sources.push({
                        documentName:
                        fragment.documentName,

                        pageNumber,
                    });
                }
            }
        }

        const prompt =
            this.promptService
                .buildPromptForChat()
                .withUserRole(
                    userRole,
                )
                .withContext(
                    preparedContext,
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
                    message:
                    prompt,
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