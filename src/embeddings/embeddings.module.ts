import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AiModule } from '../ai/ai.module';

import { EmbeddingsController } from './embeddings.controller';
import { EmbeddingsService } from './embeddings.service';

@Module({
    imports: [
        ConfigModule,
        AiModule,
    ],
    controllers: [
        EmbeddingsController,
    ],
    providers: [
        EmbeddingsService,
    ],
    exports: [
        EmbeddingsService,
    ],
})
export class EmbeddingsModule {}