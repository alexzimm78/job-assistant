export class GeminiRequestPart {
    text: string;
}

export class GeminiRequestContent {
    parts: GeminiRequestPart[];
}

export class GeminiRequest {
    contents: GeminiRequestContent[];
}