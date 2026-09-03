import { Module } from '@nestjs/common';

import {
    EmbeddingsModule,
} from '../embeddings/embeddings.module';
import {
    VectorStorageModule,
} from '../vector-storage/vector-storage.module';

import {
    ChatController,
} from './chat.controller';
import {
    ChatService,
} from './chat.service';

@Module({
    imports: [
        EmbeddingsModule,
        VectorStorageModule,
    ],
    controllers: [
        ChatController,
    ],
    providers: [
        ChatService,
    ],
})
export class ChatModule {}