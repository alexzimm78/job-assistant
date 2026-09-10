import {
    UserRole,
} from '../user/enums/user-role.enum';

import {
    PromptBuilder,
} from './prompt.builder';

describe(
    'PromptBuilder',
    () => {
        it(
            'soll einen vollständigen Chat-Prompt in der richtigen Reihenfolge erstellen',
            () => {
                const prompt =
                    new PromptBuilder([
                        'Antworte nur mit Informationen aus dem Wissenskontext.',
                    ])
                        .withUserRole(
                            UserRole.CANDIDATE,
                        )
                        .withContext([
                            'Für die Bewerbung wird ein Lebenslauf benötigt.',
                        ])
                        .withChatHistory([
                            {
                                userRequest:
                                    'Welche Unterlagen brauche ich?',
                                aiAnswer:
                                    'Du benötigst einen Lebenslauf.',
                            },
                        ])
                        .withQuestion(
                            'Brauche ich auch ein Anschreiben?',
                        )
                        .build();

                expect(prompt)
                    .toContain(
                        'SYSTEM INSTRUCTIONS',
                    );

                expect(prompt)
                    .toContain(
                        'USER ROLE',
                    );

                expect(prompt)
                    .toContain(
                        UserRole.CANDIDATE,
                    );

                expect(prompt)
                    .toContain(
                        'KNOWLEDGE CONTEXT',
                    );

                expect(prompt)
                    .toContain(
                        'Für die Bewerbung wird ein Lebenslauf benötigt.',
                    );

                expect(prompt)
                    .toContain(
                        'CONVERSATION HISTORY',
                    );

                expect(prompt)
                    .toContain(
                        'Welche Unterlagen brauche ich?',
                    );

                expect(prompt)
                    .toContain(
                        'CURRENT QUESTION',
                    );

                expect(prompt)
                    .toContain(
                        'Brauche ich auch ein Anschreiben?',
                    );
            },
        );

        it(
            'soll die Methoden als Builder-Kette verwenden können',
            () => {
                const builder =
                    new PromptBuilder([
                        'Testanweisung',
                    ]);

                expect(
                    builder.withUserRole(
                        UserRole.CANDIDATE,
                    ),
                ).toBe(builder);

                expect(
                    builder.withContext([]),
                ).toBe(builder);

                expect(
                    builder.withChatHistory([]),
                ).toBe(builder);

                expect(
                    builder.withQuestion(
                        'Testfrage',
                    ),
                ).toBe(builder);

                expect(
                    typeof builder.build(),
                ).toBe('string');
            },
        );
    },
);