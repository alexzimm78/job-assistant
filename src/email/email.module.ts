import { Module } from '@nestjs/common';
import {
    ConfigModule,
    ConfigService,
} from '@nestjs/config';

import {
    MailerModule,
} from '@nestjs-modules/mailer';

import { EmailService } from './email.service';

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [
                ConfigModule,
            ],
            inject: [
                ConfigService,
            ],
            useFactory: (
                configService: ConfigService,
            ) => {
                const port = Number(
                    configService.get<string>(
                        'MAIL_PORT',
                        '587',
                    ),
                );

                const user =
                    configService.get<string>(
                        'MAIL_USER',
                    );

                return {
                    transport: {
                        host:
                            configService.get<string>(
                                'MAIL_HOST',
                            ),
                        port,
                        secure: port === 465,
                        auth: {
                            user,
                            pass:
                                configService.get<string>(
                                    'MAIL_PASSWORD',
                                ),
                        },
                    },
                    defaults: {
                        from:
                            `"AI Job Assistant" <${user}>`,
                    },
                };
            },
        }),
    ],
    providers: [
        EmailService,
    ],
    exports: [
        EmailService,
    ],
})
export class EmailModule {}