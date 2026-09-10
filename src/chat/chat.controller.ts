import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Req,
} from '@nestjs/common';

import {
    ApiBadGatewayResponse,
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import {
    Request,
} from 'express';

import {
    TokenPayload,
} from '../auth/interfaces/token-payload.interface';

import {
    ChatRequestDto,
} from './dto/chat-request.dto';
import {
    ChatResponseDto,
} from './dto/chat-response.dto';
import {
    ChatService,
} from './chat.service';

@ApiTags('chat')
@ApiBearerAuth('access-token')
@Controller('chat')
export class ChatController {
    constructor(
        private readonly chatService:
        ChatService,
    ) {
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary:
            'Frage mit dem RAG-Pipeline beantworten',
    })
    @ApiOkResponse({
        description:
            'Die KI-Antwort wurde auf Grundlage der Wissensdatenbank erstellt',
        type: ChatResponseDto,
    })
    @ApiBadRequestResponse({
        description:
            'Die übergebene Frage ist ungültig',
    })
    @ApiBadGatewayResponse({
        description:
            'Fehler bei der Verbindung zu Gemini oder Qdrant',
    })
    async search(
        @Body()
        chatRequest: ChatRequestDto,
        @Req()
        httpRequest:
            Request & {
            user: TokenPayload;
        },
    ): Promise<ChatResponseDto> {
        return this.chatService
            .search(
                chatRequest,
                httpRequest.user.sub,
                httpRequest.user.role,
            );
    }
}