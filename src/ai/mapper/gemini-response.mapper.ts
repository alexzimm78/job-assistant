import { AskAiResponseDto } from '../dto/ask-ai-response.dto';
import { GeminiResponse } from '../models/gemini-response.model';

export class GeminiResponseMapper {
    static toAskAiResponseDto(
        response: GeminiResponse,
    ): AskAiResponseDto {
        const answer =
            response.candidates[0]?.content.parts[0]?.text;

        return {
            answer:
                answer ??
                'Das KI-Modell hat keine Antwort zurückgegeben.',
        };
    }
}