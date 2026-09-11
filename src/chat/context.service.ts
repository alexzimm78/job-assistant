import {
    Injectable,
} from '@nestjs/common';

import {
    ConfigService,
} from '@nestjs/config';

import {
    QdrantSearchResult,
} from '../vector-storage/qdrant/models/qdrant-search-result.model';

import {
    ContextFragment,
} from './models/context-fragment.model';

@Injectable()
export class ContextService {
    constructor(
        private readonly configService:
        ConfigService,
    ) {
    }

    generateContext(
        chunks: QdrantSearchResult[],
    ): ContextFragment[] {
        const groupedChunks =
            this.groupByDocument(
                chunks,
            );

        const mergedFragments:
            ContextFragment[] = [];

        for (
            const documentChunks
            of groupedChunks.values()
            ) {
            const sortedChunks =
                this.sortByChunkIndex(
                    documentChunks,
                );

            const documentFragments =
                this.mergeNeighboringChunks(
                    sortedChunks,
                );

            mergedFragments.push(
                ...documentFragments,
            );
        }

        return this.applyContextLimit(
            mergedFragments,
        );
    }

    private groupByDocument(
        chunks: QdrantSearchResult[],
    ): Map<string, QdrantSearchResult[]> {
        const groups =
            new Map<
                string,
                QdrantSearchResult[]
            >();

        for (const chunk of chunks) {
            const documentId =
                chunk.payload.documentId;

            if (
                typeof documentId !==
                'string' ||
                documentId.trim().length === 0
            ) {
                continue;
            }

            const documentChunks =
                groups.get(documentId) ?? [];

            documentChunks.push(chunk);

            groups.set(
                documentId,
                documentChunks,
            );
        }

        return groups;
    }

    private sortByChunkIndex(
        chunks: QdrantSearchResult[],
    ): QdrantSearchResult[] {
        return [...chunks]
            .filter(
                chunk =>
                    typeof chunk.payload
                        .chunkIndex ===
                    'number',
            )
            .sort(
                (
                    firstChunk,
                    secondChunk,
                ) =>
                    this.getChunkIndex(
                        firstChunk,
                    ) -
                    this.getChunkIndex(
                        secondChunk,
                    ),
            );
    }

    private mergeNeighboringChunks(
        chunks: QdrantSearchResult[],
    ): ContextFragment[] {
        if (chunks.length === 0) {
            return [];
        }

        const fragments:
            ContextFragment[] = [];

        let currentFragment =
            this.createFragment(
                chunks[0],
            );

        let previousIndex =
            this.getChunkIndex(
                chunks[0],
            );

        for (
            let index = 1;
            index < chunks.length;
            index += 1
        ) {
            const chunk =
                chunks[index];

            const currentIndex =
                this.getChunkIndex(
                    chunk,
                );

            const isNeighbor =
                currentIndex ===
                previousIndex + 1;

            if (isNeighbor) {
                currentFragment =
                    this.mergeChunkIntoFragment(
                        currentFragment,
                        chunk,
                    );
            } else {
                fragments.push(
                    currentFragment,
                );

                currentFragment =
                    this.createFragment(
                        chunk,
                    );
            }

            previousIndex =
                currentIndex;
        }

        fragments.push(
            currentFragment,
        );

        return fragments;
    }

    private createFragment(
        chunk: QdrantSearchResult,
    ): ContextFragment {
        const payload =
            chunk.payload;

        const documentId =
            typeof payload.documentId ===
            'string'
                ? payload.documentId
                : '';

        const documentName =
            typeof payload.documentName ===
            'string'
                ? payload.documentName
                : typeof payload.source ===
                'string'
                    ? payload.source
                    : documentId;

        const documentVersion =
            typeof payload.documentVersion ===
            'number'
                ? payload.documentVersion
                : undefined;

        const pageNumber =
            typeof payload.pageNumber ===
            'number'
                ? payload.pageNumber
                : undefined;

        return {
            content:
                this.getChunkContent(
                    chunk,
                ),

            documentId,

            documentName,

            ...(documentVersion !==
            undefined
                ? {
                    documentVersion,
                }
                : {}),

            pageNumbers:
                pageNumber !== undefined
                    ? [pageNumber]
                    : [],

            chunkIndexes: [
                this.getChunkIndex(
                    chunk,
                ),
            ],

            relevanceScore:
            chunk.score,
        };
    }

    private mergeChunkIntoFragment(
        fragment: ContextFragment,
        chunk: QdrantSearchResult,
    ): ContextFragment {
        const pageNumber =
            typeof chunk.payload.pageNumber ===
            'number'
                ? chunk.payload.pageNumber
                : undefined;

        const pageNumbers = [
            ...fragment.pageNumbers,
        ];

        if (
            pageNumber !== undefined &&
            !pageNumbers.includes(
                pageNumber,
            )
        ) {
            pageNumbers.push(
                pageNumber,
            );
        }

        return {
            ...fragment,

            content:
                this.mergeContentWithoutOverlap(
                    fragment.content,
                    this.getChunkContent(
                        chunk,
                    ),
                ),

            pageNumbers,

            chunkIndexes: [
                ...fragment.chunkIndexes,
                this.getChunkIndex(
                    chunk,
                ),
            ],

            relevanceScore:
                Math.max(
                    fragment.relevanceScore,
                    chunk.score,
                ),
        };
    }

    private mergeContentWithoutOverlap(
        previousContent: string,
        nextContent: string,
    ): string {
        const overlap =
            this.getChunkOverlap();

        const maximumOverlap =
            Math.min(
                overlap,
                previousContent.length,
                nextContent.length,
            );

        let actualOverlap = 0;

        for (
            let length =
                maximumOverlap;
            length > 0;
            length -= 1
        ) {
            const previousEnding =
                previousContent.slice(
                    -length,
                );

            const nextBeginning =
                nextContent.slice(
                    0,
                    length,
                );

            if (
                previousEnding ===
                nextBeginning
            ) {
                actualOverlap =
                    length;

                break;
            }
        }

        const contentWithoutOverlap =
            nextContent.slice(
                actualOverlap,
            );

        if (actualOverlap > 0) {
            return (
                previousContent +
                contentWithoutOverlap
            ).trim();
        }

        return [
            previousContent,
            contentWithoutOverlap,
        ]
            .filter(
                content =>
                    content.trim().length >
                    0,
            )
            .join(' ')
            .trim();
    }

    private applyContextLimit(
        fragments: ContextFragment[],
    ): ContextFragment[] {
        const sortedFragments =
            [...fragments].sort(
                (
                    firstFragment,
                    secondFragment,
                ) =>
                    secondFragment
                        .relevanceScore -
                    firstFragment
                        .relevanceScore,
            );

        const maxContextSize =
            this.getMaxContextSize();

        const selectedFragments:
            ContextFragment[] = [];

        let currentContextSize = 0;

        for (
            const fragment
            of sortedFragments
            ) {
            const fragmentSize =
                this.getTextSize(
                    fragment.content,
                );

            if (
                currentContextSize +
                fragmentSize >
                maxContextSize
            ) {
                continue;
            }

            selectedFragments.push(
                fragment,
            );

            currentContextSize +=
                fragmentSize;
        }

        return selectedFragments;
    }

    private getChunkContent(
        chunk: QdrantSearchResult,
    ): string {
        const content =
            chunk.payload.chunkText ??
            chunk.payload.content ??
            chunk.payload.text ??
            '';

        return typeof content ===
        'string'
            ? content.trim()
            : '';
    }

    private getChunkIndex(
        chunk: QdrantSearchResult,
    ): number {
        const chunkIndex =
            chunk.payload.chunkIndex;

        return typeof chunkIndex ===
        'number'
            ? chunkIndex
            : -1;
    }

    private getChunkOverlap():
        number {
        const configuredOverlap =
            Number(
                this.configService
                    .get<string>(
                        'DOCUMENT_CHUNK_OVERLAP',
                    ) ?? '200',
            );

        return Number.isFinite(
            configuredOverlap,
        ) &&
        configuredOverlap >= 0
            ? configuredOverlap
            : 200;
    }

    private getMaxContextSize():
        number {
        const configuredSize =
            Number(
                this.configService
                    .get<string>(
                        'MAX_CONTEXT_SIZE',
                    ) ?? '4000',
            );

        return Number.isFinite(
            configuredSize,
        ) &&
        configuredSize > 0
            ? configuredSize
            : 4000;
    }

    private getTextSize(
        text: string,
    ): number {
        return text.length;
    }
}