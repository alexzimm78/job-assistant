import {
    Injectable,
    Logger,
    OnModuleInit,
} from '@nestjs/common';

import {
    ConfigService,
} from '@nestjs/config';

import {
    QdrantClient as QdrantRestClient,
} from '@qdrant/js-client-rest';

import {
    QdrantPoint,
} from './models/qdrant-point.model';
import {
    QdrantSearchResult,
} from './models/qdrant-search-result.model';
import {
    SearchFilter,
} from './models/search-filter.model';

@Injectable()
export class QdrantClient implements OnModuleInit {
    private readonly logger =
        new Logger(QdrantClient.name);

    private readonly client:
        QdrantRestClient;

    private readonly collectionName:
        string;

    private readonly archiveCollectionName:
        string;

    private readonly vectorSize:
        number;

    constructor(
        private readonly configService:
        ConfigService,
    ) {
        const url =
            this.configService
                .getOrThrow<string>(
                    'QDRANT_URL',
                );

        this.collectionName =
            this.configService
                .getOrThrow<string>(
                    'QDRANT_COLLECTION',
                );

        this.archiveCollectionName =
            this.configService
                .getOrThrow<string>(
                    'QDRANT_ARCHIVE_COLLECTION',
                );

        this.vectorSize =
            Number(
                this.configService
                    .getOrThrow<string>(
                        'QDRANT_VECTOR_SIZE',
                    ),
            );

        if (
            !Number.isInteger(
                this.vectorSize,
            ) ||
            this.vectorSize <= 0
        ) {
            throw new Error(
                'QDRANT_VECTOR_SIZE muss eine positive ganze Zahl sein',
            );
        }

        this.client =
            new QdrantRestClient({
                url,
            });
    }

    async onModuleInit():
        Promise<void> {
        await this.createCollectionIfNotExists(
            this.collectionName,
        );

        await this.createCollectionIfNotExists(
            this.archiveCollectionName,
        );
    }

    private async createCollectionIfNotExists(
        collectionName: string,
    ): Promise<void> {
        const result =
            await this.client
                .collectionExists(
                    collectionName,
                );

        if (result.exists) {
            this.logger.log(
                `Collection bereits vorhanden: ${collectionName}`,
            );

            return;
        }

        await this.client
            .createCollection(
                collectionName,
                {
                    vectors: {
                        size:
                        this.vectorSize,
                        distance:
                            'Cosine',
                    },
                },
            );

        this.logger.log(
            `Collection erstellt: ${collectionName}`,
        );
    }

    // --------------------------------------------------
    // POINTS IN ACTIVE COLLECTION SPEICHERN
    // --------------------------------------------------

    async save(
        points: QdrantPoint[],
    ): Promise<void> {
        await this.client.upsert(
            this.collectionName,
            {
                wait:
                    true,
                points,
            },
        );

        this.logger.log(
            `Points gespeichert: ${points.length}`,
        );
    }

    // --------------------------------------------------
    // POINTS IN ARCHIVE COLLECTION SPEICHERN
    // --------------------------------------------------

    async saveToArchive(
        points: QdrantPoint[],
    ): Promise<void> {
        await this.client.upsert(
            this.archiveCollectionName,
            {
                wait:
                    true,
                points,
            },
        );

        this.logger.log(
            `Points archiviert: ${points.length}`,
        );
    }

    // --------------------------------------------------
    // ACTIVE POINTS NACH DOCUMENT-ID SUCHEN
    // --------------------------------------------------

    async findPointsByDocumentId(
        documentId: string,
    ): Promise<QdrantPoint[]> {
        const foundPoints:
            QdrantPoint[] = [];

        let offset:
            string |
            number |
            Record<string, unknown> |
            undefined;

        do {
            const response =
                await this.client.scroll(
                    this.collectionName,
                    {
                        filter: {
                            must: [
                                {
                                    key:
                                        'documentId',
                                    match: {
                                        value:
                                        documentId,
                                    },
                                },
                            ],
                        },
                        limit:
                            100,
                        offset,
                        with_payload:
                            true,
                        with_vector:
                            true,
                    },
                );

            const points =
                response.points.map(
                    (
                        point,
                    ): QdrantPoint => ({
                        id:
                            String(point.id),

                        vector:
                            point.vector as number[],

                        payload:
                            point.payload as
                                QdrantPoint['payload'],
                    }),
                );

            foundPoints.push(
                ...points,
            );

            offset =
                response.next_page_offset ??
                undefined;
        } while (offset !== undefined);

        this.logger.log(
            `Points für Dokument ${documentId} gefunden: ${foundPoints.length}`,
        );

        return foundPoints;
    }

    // --------------------------------------------------
    // POINTS AUS ACTIVE COLLECTION LÖSCHEN
    // --------------------------------------------------

    async deletePoints(
        points: QdrantPoint[],
    ): Promise<void> {
        if (points.length === 0) {
            return;
        }

        await this.client.delete(
            this.collectionName,
            {
                wait:
                    true,
                points:
                    points.map(
                        (
                            point,
                        ) =>
                            point.id,
                    ),
            },
        );

        this.logger.log(
            `Points aus aktiver Collection gelöscht: ${points.length}`,
        );
    }

    // --------------------------------------------------
    // SEMANTISCHE SUCHE NUR IN ACTIVE COLLECTION
    // --------------------------------------------------

    async search(
        vector: number[],
        limit: number,
        filter?: SearchFilter,
    ): Promise<QdrantSearchResult[]> {
        const response =
            await this.client.query(
                this.collectionName,
                {
                    query:
                    vector,
                    limit,
                    with_payload:
                        true,
                    with_vector:
                        false,
                    ...(
                        filter
                            ? {
                                filter,
                            }
                            : {}
                    ),
                },
            );

        const results =
            response.points;

        this.logger.log(
            `Semantische Suchergebnisse: ${results.length}`,
        );

        return results.map(
            (
                result,
            ): QdrantSearchResult => ({
                id:
                result.id,
                score:
                result.score,
                payload:
                    result.payload ?? {},
            }),
        );
    }
}