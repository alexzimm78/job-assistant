export class QdrantSearchResult {
    id: string | number;

    score: number;

    payload: Record<string, unknown>;
}
