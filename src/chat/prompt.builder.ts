import {
    UserRole,
} from '../user/enums/user-role.enum';

import {
    ChatMessage,
} from './models/chat-message.model';

export class PromptBuilder {
    private userRole?: UserRole;

    private context: string[] = [];

    private chatHistory: ChatMessage[] = [];

    private question: string = '';

    constructor(
        private readonly systemInstructions:
        string[],
    ) {
    }

    withUserRole(
        role: UserRole,
    ): PromptBuilder {
        this.userRole = role;

        return this;
    }

    withContext(
        chunks: string[],
    ): PromptBuilder {
        this.context = chunks;

        return this;
    }

    withChatHistory(
        history: ChatMessage[],
    ): PromptBuilder {
        this.chatHistory = history;

        return this;
    }

    withQuestion(
        question: string,
    ): PromptBuilder {
        this.question = question;

        return this;
    }

    build(): string {
        const knowledgeContext =
            this.context.length > 0
                ? this.context.join(
                    '\n\n',
                )
                : 'Keine relevanten Informationen gefunden.';

        const conversationHistory =
            this.chatHistory.length > 0
                ? this.chatHistory
                    .map(
                        (
                            message,
                            index,
                        ) => [
                            `Nachricht ${index + 1}:`,
                            `Benutzer: ${message.userRequest}`,
                            `AI: ${message.aiAnswer}`,
                        ].join('\n'),
                    )
                    .join('\n\n')
                : 'Noch keine vorherigen Nachrichten.';

        return [
            'SYSTEM INSTRUCTIONS',
            ...this.systemInstructions,
            '',
            'USER ROLE',
            this.userRole ??
            'Unbekannt',
            '',
            'KNOWLEDGE CONTEXT',
            knowledgeContext,
            '',
            'CONVERSATION HISTORY',
            conversationHistory,
            '',
            'CURRENT QUESTION',
            this.question,
        ].join('\n');
    }
}