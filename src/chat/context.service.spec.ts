import {
    ConfigService,
} from '@nestjs/config';

import {
    QdrantSearchResult,
} from '../vector-storage/qdrant/models/qdrant-search-result.model';

import {
    ContextService,
} from './context.service';

describe(
    'ContextService',
    () => {
        const createResult = (
            documentId: string,
            chunkIndex: number,
            content: string,
            score: number,
            documentName =
            'test.txt',
        ): QdrantSearchResult => ({
            id:
                `${documentId}-${chunkIndex}`,

            score,

            payload: {
                documentId,
                documentName,
                documentVersion: 1,
                chunkIndex,
                chunkText:
                content,
            },
        });

        const createService = (
            overlap = 2,
            maxContextSize = 1000,
        ): ContextService => {
            const configService = {
                get: jest.fn(
                    (
                        key: string,
                    ): string | undefined => {
                        if (
                            key ===
                            'DOCUMENT_CHUNK_OVERLAP'
                        ) {
                            return String(
                                overlap,
                            );
                        }

                        if (
                            key ===
                            'MAX_CONTEXT_SIZE'
                        ) {
                            return String(
                                maxContextSize,
                            );
                        }

                        return undefined;
                    },
                ),
            } as unknown as ConfigService;

            return new ContextService(
                configService,
            );
        };

        it(
            'soll benachbarte Chunks verbinden und den Overlap entfernen',
            () => {
                const service =
                    createService();

                const result =
                    service.generateContext([
                        createResult(
                            'DOC-001',
                            1,
                            'DEFGH',
                            0.94,
                        ),

                        createResult(
                            'DOC-001',
                            0,
                            'ABCDE',
                            0.81,
                        ),
                    ]);

                expect(result)
                    .toHaveLength(1);

                expect(
                    result[0].content,
                ).toBe(
                    'ABCDEFGH',
                );

                expect(
                    result[0]
                        .chunkIndexes,
                ).toEqual([
                    0,
                    1,
                ]);

                expect(
                    result[0]
                        .relevanceScore,
                ).toBe(0.94);
            },
        );

        it(
            'soll Chunks mit einer Lücke getrennt lassen',
            () => {
                const service =
                    createService();

                const result =
                    service.generateContext([
                        createResult(
                            'DOC-001',
                            3,
                            'Chunk drei',
                            0.90,
                        ),

                        createResult(
                            'DOC-001',
                            4,
                            'Chunk vier',
                            0.85,
                        ),

                        createResult(
                            'DOC-001',
                            8,
                            'Chunk acht',
                            0.80,
                        ),
                    ]);

                expect(result)
                    .toHaveLength(2);

                expect(
                    result.some(
                        fragment =>
                            fragment
                                .chunkIndexes
                                .join(',') ===
                            '3,4',
                    ),
                ).toBe(true);

                expect(
                    result.some(
                        fragment =>
                            fragment
                                .chunkIndexes
                                .join(',') ===
                            '8',
                    ),
                ).toBe(true);
            },
        );

        it(
            'soll Chunks verschiedener Dokumente nicht verbinden',
            () => {
                const service =
                    createService();

                const result =
                    service.generateContext([
                        createResult(
                            'DOC-001',
                            3,
                            'Dokument eins',
                            0.90,
                            'eins.txt',
                        ),

                        createResult(
                            'DOC-002',
                            4,
                            'Dokument zwei',
                            0.88,
                            'zwei.txt',
                        ),
                    ]);

                expect(result)
                    .toHaveLength(2);

                expect(
                    result.map(
                        fragment =>
                            fragment
                                .documentId,
                    ),
                ).toEqual(
                    expect.arrayContaining([
                        'DOC-001',
                        'DOC-002',
                    ]),
                );
            },
        );

        it(
            'soll für verbundene Chunks den höchsten Score verwenden',
            () => {
                const service =
                    createService();

                const result =
                    service.generateContext([
                        createResult(
                            'DOC-001',
                            0,
                            'AAAA',
                            0.81,
                        ),

                        createResult(
                            'DOC-001',
                            1,
                            'AABB',
                            0.94,
                        ),

                        createResult(
                            'DOC-001',
                            2,
                            'BBCC',
                            0.87,
                        ),
                    ]);

                expect(result)
                    .toHaveLength(1);

                expect(
                    result[0]
                        .relevanceScore,
                ).toBe(0.94);
            },
        );

        it(
            'soll das Kontextlimit beachten und relevante Fragmente bevorzugen',
            () => {
                const service =
                    createService(
                        0,
                        10,
                    );

                const result =
                    service.generateContext([
                        createResult(
                            'DOC-001',
                            0,
                            'AAAAAA',
                            0.94,
                        ),

                        createResult(
                            'DOC-001',
                            2,
                            'BBBBBB',
                            0.91,
                        ),

                        createResult(
                            'DOC-001',
                            4,
                            'CCCC',
                            0.83,
                        ),
                    ]);

                expect(
                    result.map(
                        fragment =>
                            fragment.content,
                    ),
                ).toEqual([
                    'AAAAAA',
                    'CCCC',
                ]);

                const totalSize =
                    result.reduce(
                        (
                            sum,
                            fragment,
                        ) =>
                            sum +
                            fragment
                                .content
                                .length,
                        0,
                    );

                expect(
                    totalSize,
                ).toBeLessThanOrEqual(
                    10,
                );
            },
        );
    },
);