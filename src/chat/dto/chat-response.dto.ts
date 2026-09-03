import { ApiProperty } from '@nestjs/swagger';

import {
    ChatSearchResultDto,
} from './chat-search-result.dto';

export class ChatResponseDto {
    @ApiProperty({
        description:
            'Top-K der relevantesten Textabschnitte',
        type: [
            ChatSearchResultDto,
        ],
    })
    chunks: ChatSearchResultDto[];
}