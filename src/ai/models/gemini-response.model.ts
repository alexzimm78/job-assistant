export class GeminiResponsePart {
    text: string;
}

export class GeminiResponseContent {
    parts: GeminiResponsePart[];
    role: string;
}

export class GeminiCandidate {
    content: GeminiResponseContent;
    finishReason: string;
    index: number;
}

export class GeminiResponse {
    candidates: GeminiCandidate[];
}