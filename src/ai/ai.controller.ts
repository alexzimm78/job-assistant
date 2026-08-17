import {
    Body,
    Controller,
    Post,
} from '@nestjs/common';

import {
    ApiBadGatewayResponse,
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

import {AiService} from './ai.service';
import {AskAiRequestDto} from './dto/ask-ai-request.dto';
import {AskAiResponseDto} from './dto/ask-ai-response.dto';
import {Public} from '../auth/decorators/public.decorator';

@ApiTags('ai')
@Controller('ai')
export class AiController {
    constructor(
        private readonly aiService: AiService,
    ) {
    }

    @Public()
    @Post('chat')
    @ApiOperation({
        summary:
            'Nachricht an das KI-Modell senden',
    })
    @ApiBadRequestResponse({
        description:
            'Die übermittelte Nachricht ist ungültig',
    })
    @ApiCreatedResponse({
        description:
            'Antwort wurde erfolgreich generiert',
        type: AskAiResponseDto,
    })
    @ApiBadGatewayResponse({
        description:
            'Der externe KI-Dienst ist nicht erreichbar',
    })
    async ask(
        @Body() dto: AskAiRequestDto,
    ): Promise<AskAiResponseDto> {
        return this.aiService.ask(dto);
    }
}