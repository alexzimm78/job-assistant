import { Embedding } from '../models/embedding.model';
import { GeminiEmbeddingResponse } from '../models/gemini-embedding-response.model';

export class GeminiEmbeddingResponseMapper {
    static toEmbedding(
        response: GeminiEmbeddingResponse,
    ): Embedding {
        return response.embedding.values;
    }
}