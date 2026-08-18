import {
    BadGatewayException,
    Injectable,
    Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import axios, {
    AxiosResponse,
    isAxiosError,
} from 'axios';

import { GeminiEmbeddingRequest } from '../embeddings/models/gemini-embedding-request.model';
import { GeminiEmbeddingResponse } from '../embeddings/models/gemini-embedding-response.model';

import { AskAiRequestDto } from './dto/ask-ai-request.dto';
import { AskAiResponseDto } from './dto/ask-ai-response.dto';
import { GeminiRequestMapper } from './mapper/gemini-request.mapper';
import { GeminiResponseMapper } from './mapper/gemini-response.mapper';
import { GeminiRequest } from './models/gemini-request.model';
import { GeminiResponse } from './models/gemini-response.model';

@Injectable()
export class AiService {
    private readonly logger =
        new Logger(AiService.name);

    constructor(
        private readonly configService: ConfigService,
    ) {}

    async ask(
        dto: AskAiRequestDto,
    ): Promise<AskAiResponseDto> {
        const apiKey =
            this.configService.getOrThrow<string>(
                'GEMINI_API_KEY',
            );

        const model =
            this.configService.get<string>(
                'GEMINI_MODEL',
            ) ?? 'gemini-3.6-flash';

        const url =
            `https://generativelanguage.googleapis.com/` +
            `v1beta/models/${model}:generateContent`;

        const request: GeminiRequest =
            GeminiRequestMapper.toGeminiRequest(dto);

        try {
            const response: AxiosResponse<GeminiResponse> =
                await axios.post<
                    GeminiResponse,
                    AxiosResponse<GeminiResponse>,
                    GeminiRequest
                >(
                    url,
                    request,
                    {
                        headers: {
                            'Content-Type':
                                'application/json',
                            'x-goog-api-key': apiKey,
                        },
                    },
                );

            return GeminiResponseMapper
                .toAskAiResponseDto(response.data);
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                this.logger.error(
                    `Gemini API Fehler: ${error.message}`,
                );
            } else {
                this.logger.error(
                    'Unbekannter Fehler beim Gemini-Aufruf',
                );
            }

            throw new BadGatewayException(
                'Die Antwort des KI-Dienstes konnte nicht abgerufen werden',
            );
        }
    }

    async createEmbedding(
        request: GeminiEmbeddingRequest,
    ): Promise<GeminiEmbeddingResponse> {
        const apiKey =
            this.configService.getOrThrow<string>(
                'GEMINI_API_KEY',
            );

        const url =
            `https://generativelanguage.googleapis.com/` +
            `v1beta/${request.model}:embedContent`;

        try {
            const response:
                AxiosResponse<GeminiEmbeddingResponse> =
                await axios.post<
                    GeminiEmbeddingResponse,
                    AxiosResponse<GeminiEmbeddingResponse>,
                    GeminiEmbeddingRequest
                >(
                    url,
                    request,
                    {
                        headers: {
                            'Content-Type':
                                'application/json',
                            'x-goog-api-key': apiKey,
                        },
                    },
                );

            return response.data;
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                this.logger.error(
                    `Gemini Embedding API Fehler: ${error.message}`,
                );
            } else {
                this.logger.error(
                    'Unbekannter Fehler beim Gemini-Embedding-Aufruf',
                );
            }

            throw new BadGatewayException(
                'Die Embeddings konnten nicht abgerufen werden',
            );
        }
    }
}