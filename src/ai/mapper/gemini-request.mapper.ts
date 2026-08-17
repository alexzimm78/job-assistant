import { AskAiRequestDto } from '../dto/ask-ai-request.dto';
import { GeminiRequest } from '../models/gemini-request.model';

export class GeminiRequestMapper {
    static toGeminiRequest(
        dto: AskAiRequestDto,
    ): GeminiRequest {
        return {
            contents: [
                {
                    parts: [
                        {
                            text: dto.message,
                        },
                    ],
                },
            ],
        };
    }
}