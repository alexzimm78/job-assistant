import { EmbeddingRequestDto } from '../dto/embedding-request.dto';
import { GeminiEmbeddingRequest } from '../models/gemini-embedding-request.model';

export class GeminiEmbeddingRequestMapper {
    static toGeminiEmbeddingRequests(
        dto: EmbeddingRequestDto,
        model: string,
    ): GeminiEmbeddingRequest[] {
        return dto.texts.map(
            (text: string): GeminiEmbeddingRequest => ({
                model: `models/${model}`,
                content: {
                    parts: [
                        {
                            text,
                        },
                    ],
                },
            }),
        );
    }
}