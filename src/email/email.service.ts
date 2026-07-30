import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
    constructor(
        private readonly mailerService: MailerService,
        private readonly configService: ConfigService,
    ) {}

    async sendRegistrationConfirmation(
        email: string,
        code: string,
    ): Promise<void> {
        const appUrl =
            this.configService.get<string>(
                'APP_URL',
                'http://localhost:3000',
            );

        const confirmationUrl =
            `${appUrl}/users/confirm/${code}`;

        await this.mailerService.sendMail({
            to: email,
            subject:
                'Registrierung beim AI Job Assistant bestätigen',
            text:
                'Bitte bestätigen Sie Ihre Registrierung über diesen Link: ' +
                confirmationUrl,
            html: `
                <h2>Registrierung bestätigen</h2>
                <p>
                    Vielen Dank für Ihre Registrierung
                    beim AI Job Assistant.
                </p>
                <p>
                    Klicken Sie auf den folgenden Link,
                    um Ihr Benutzerkonto zu aktivieren:
                </p>
                <p>
                    <a href="${confirmationUrl}">
                        Benutzerkonto aktivieren
                    </a>
                </p>
                <p>
                    Der Bestätigungslink ist 24 Stunden gültig.
                </p>
            `,
        });
    }
}