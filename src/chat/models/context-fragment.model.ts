export interface ContextFragment {
    content: string;

    documentId: string;

    documentName: string;

    documentVersion?: number;

    pageNumbers: number[];

    chunkIndexes: number[];

    relevanceScore: number;
}