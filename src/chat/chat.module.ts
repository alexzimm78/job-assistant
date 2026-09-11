import {
    Module,
} from '@nestjs/common';

import {
    AiModule,
} from '../ai/ai.module';

import {
    EmbeddingsModule,
} from '../embeddings/embeddings.module';

import {
    VectorStorageModule,
} from '../vector-storage/vector-storage.module';

import {
    AccessScopeService,
} from './access-scope.service';

import {
    ChatController,
} from './chat.controller';

import {
    ChatHistoryService,
} from './chat-history.service';

import {
    ChatService,
} from './chat.service';

import {
    ContextService,
} from './context.service';

import {
    PromptService,
} from './prompt.service';

@Module({
    imports: [
        AiModule,
        EmbeddingsModule,
        VectorStorageModule,
    ],

    controllers: [
        ChatController,
    ],

    providers: [
        AccessScopeService,
        ChatHistoryService,
        ChatService,
        ContextService,
        PromptService,
    ],
})
export class ChatModule {
}