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
    ChatService,
} from './chat.service';

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
        ChatService,
    ],
})
export class ChatModule {
}