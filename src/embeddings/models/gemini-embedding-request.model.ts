export class GeminiEmbeddingPart {
    text: string;
}

export class GeminiEmbeddingContent {
    parts: GeminiEmbeddingPart[];
}

export class GeminiEmbeddingRequest {
    model: string;
    content: GeminiEmbeddingContent;
}