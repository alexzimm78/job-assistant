import {
    Injectable,
    Logger,
    OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
    QdrantClient as QdrantRestClient,
} from '@qdrant/js-client-rest';

import { QdrantPoint } from './models/qdrant-point.model';
import { QdrantSearchResult } from './models/qdrant-search-result.model';

@Injectable()
export class QdrantClient implements OnModuleInit {
    private readonly logger =
        new Logger(QdrantClient.name);

    private readonly client: QdrantRestClient;
    private readonly collectionName: string;
    private readonly vectorSize: number;

    constructor(
        private readonly configService: ConfigService,
    ) {
        const url =
            this.configService.getOrThrow<string>(
                'QDRANT_URL',
            );

        this.collectionName =
            this.configService.getOrThrow<string>(
                'QDRANT_COLLECTION',
            );

        this.vectorSize = Number(
            this.configService.getOrThrow<string>(
                'QDRANT_VECTOR_SIZE',
            ),
        );

        if (
            !Number.isInteger(this.vectorSize) ||
            this.vectorSize <= 0
        ) {
            throw new Error(
                'QDRANT_VECTOR_SIZE muss eine positive ganze Zahl sein',
            );
        }

        this.client = new QdrantRestClient({
            url,
        });
    }

    async onModuleInit(): Promise<void> {
        await this.createCollectionIfNotExists();
    }

    async createCollectionIfNotExists():
        Promise<void> {
        const result =
            await this.client.collectionExists(
                this.collectionName,
            );

        if (result.exists) {
            this.logger.log(
                `Collection bereits vorhanden: ${this.collectionName}`,
            );

            return;
        }

        await this.client.createCollection(
            this.collectionName,
            {
                vectors: {
                    size: this.vectorSize,
                    distance: 'Cosine',
                },
            },
        );

        this.logger.log(
            `Collection erstellt: ${this.collectionName}`,
        );
    }

    async save(
        points: QdrantPoint[],
    ): Promise<void> {
        await this.client.upsert(
            this.collectionName,
            {
                wait: true,
                points,
            },
        );

        this.logger.log(
            `Points gespeichert: ${points.length}`,
        );
    }

    async search(
        vector: number[],
        limit: number,
    ): Promise<QdrantSearchResult[]> {
        const response =
            await this.client.query(
                this.collectionName,
                {
                    query: vector,
                    limit,
                    with_payload: true,
                    with_vector: false,
                },
            );

        const results = response.points;

        this.logger.log(
            `Semantische Suchergebnisse: ${results.length}`,
        );

        return results.map(
            (result): QdrantSearchResult => ({
                id: result.id,
                score: result.score,
                payload:
                    result.payload ?? {},
            }),
        );
    }
}
