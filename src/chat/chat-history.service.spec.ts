import {
    ChatHistoryService,
} from './chat-history.service';

describe(
    'ChatHistoryService',
    () => {
        let service:
            ChatHistoryService;

        beforeEach(
            () => {
                service =
                    new ChatHistoryService();
            },
        );

        it(
            'soll Frage und AI-Antwort speichern',
            () => {
                service.addMessage(
                    1,
                    'conversation-a',
                    'Welche Dokumente brauche ich?',
                    'Du benötigst einen Lebenslauf.',
                );

                expect(
                    service.getHistory(
                        1,
                        'conversation-a',
                    ),
                ).toEqual([
                    {
                        userRequest:
                            'Welche Dokumente brauche ich?',
                        aiAnswer:
                            'Du benötigst einen Lebenslauf.',
                    },
                ]);
            },
        );

        it(
            'soll Historien verschiedener Benutzer und Dialoge trennen',
            () => {
                service.addMessage(
                    1,
                    'conversation-a',
                    'Frage von Benutzer 1',
                    'Antwort für Benutzer 1',
                );

                service.addMessage(
                    2,
                    'conversation-a',
                    'Frage von Benutzer 2',
                    'Antwort für Benutzer 2',
                );

                service.addMessage(
                    1,
                    'conversation-b',
                    'Frage aus Dialog B',
                    'Antwort aus Dialog B',
                );

                expect(
                    service.getHistory(
                        1,
                        'conversation-a',
                    ),
                ).toHaveLength(1);

                expect(
                    service.getHistory(
                        2,
                        'conversation-a',
                    )[0].userRequest,
                ).toBe(
                    'Frage von Benutzer 2',
                );

                expect(
                    service.getHistory(
                        1,
                        'conversation-b',
                    )[0].userRequest,
                ).toBe(
                    'Frage aus Dialog B',
                );
            },
        );

        it(
            'soll nur die letzten zehn Nachrichten speichern',
            () => {
                for (
                    let index = 1;
                    index <= 12;
                    index++
                ) {
                    service.addMessage(
                        1,
                        'conversation-a',
                        `Frage ${index}`,
                        `Antwort ${index}`,
                    );
                }

                const history =
                    service.getHistory(
                        1,
                        'conversation-a',
                    );

                expect(history)
                    .toHaveLength(10);

                expect(
                    history[0].userRequest,
                ).toBe('Frage 3');

                expect(
                    history[9].userRequest,
                ).toBe('Frage 12');
            },
        );
    },
);