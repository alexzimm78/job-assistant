export class QdrantPoint {
    id: string;

    vector: number[];

    payload: Record<
        string,
        string | number | boolean | null
    >;
}