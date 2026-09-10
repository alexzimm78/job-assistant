import {
    Injectable,
} from '@nestjs/common';

import {
    ChatMessage,
} from './models/chat-message.model';

@Injectable()
export class ChatHistoryService {
    private readonly maximumHistorySize:
        number = 10;

    private readonly histories =
        new Map<string, ChatMessage[]>();

    getHistory(
        userId: number,
        conversationId: string,
    ): ChatMessage[] {
        const historyKey =
            this.createHistoryKey(
                userId,
                conversationId,
            );

        const history =
            this.histories.get(
                historyKey,
            ) ?? [];

        return [...history];
    }

    addMessage(
        userId: number,
        conversationId: string,
        userRequest: string,
        aiAnswer: string,
    ): void {
        const historyKey =
            this.createHistoryKey(
                userId,
                conversationId,
            );

        const currentHistory =
            this.histories.get(
                historyKey,
            ) ?? [];

        const updatedHistory = [
            ...currentHistory,
            {
                userRequest,
                aiAnswer,
            },
        ].slice(
            -this.maximumHistorySize,
        );

        this.histories.set(
            historyKey,
            updatedHistory,
        );
    }

    private createHistoryKey(
        userId: number,
        conversationId: string,
    ): string {
        return `${userId}:${conversationId}`;
    }
}