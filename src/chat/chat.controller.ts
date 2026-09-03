import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
} from '@nestjs/common';

import {
    ApiBadGatewayResponse,
    ApiBadRequestResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import {
    Public,
} from '../auth/decorators/public.decorator';

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
@Controller('chat')
export class ChatController {
    constructor(
        private readonly chatService:
        ChatService,
    ) {}

    @Public()
    @Post()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary:
            'Top-5 relevante Chunks semantisch suchen',
    })
    @ApiOkResponse({
        description:
            'Die relevantesten Chunks wurden gefunden',
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
        request: ChatRequestDto,
    ): Promise<ChatResponseDto> {
        return this.chatService
            .search(request);
    }
}