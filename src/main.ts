import {ValidationPipe} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {DocumentBuilder, SwaggerModule} from '@nestjs/swagger';
import {WinstonModule} from 'nest-winston';
import * as winston from 'winston';
import {LoggingInterceptor} from './common/interceptors/logging.interceptor';
import {GlobalExceptionFilter} from "./common/filters/global-exception.filter";

import {AppModule} from './app.module';

async function bootstrap() {
    const logger = WinstonModule.createLogger({
        transports: [
            new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.colorize(),
                    winston.format.simple(),
                ),
            }),

            new winston.transports.File({
                filename: 'application.log',
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.json(),
                ),
            }),
        ],
    });

    const app = await NestFactory.create(AppModule, {
        logger,
    });

    app.useGlobalInterceptors(new LoggingInterceptor());
    app.useGlobalFilters(new GlobalExceptionFilter());

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    const config = new DocumentBuilder()
        .setTitle('AI Job Assistant API')
        .setDescription(
            'API für Kandidaten, Lebensläufe, Stellenangebote und Bewerbungen',
        )
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('api', app, document);

    await app.listen(3000);
}

void bootstrap();