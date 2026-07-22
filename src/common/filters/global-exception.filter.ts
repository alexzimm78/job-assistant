import {
    ArgumentsHost,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(
        GlobalExceptionFilter.name,
    );

    catch(exception: unknown, host: ArgumentsHost): void {
        const http = host.switchToHttp();

        const request = http.getRequest<Request>();
        const response = http.getResponse<Response>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionResponse =
            exception instanceof HttpException
                ? exception.getResponse()
                : {
                    statusCode: status,
                    message: 'Internal server error',
                };

        const message =
            exception instanceof Error
                ? exception.message
                : 'Unknown error';

        const stack =
            exception instanceof Error
                ? exception.stack
                : undefined;

        this.logger.error(
            `${request.method} ${request.path} failed: ${message}`,
            stack,
        );

        if (typeof exceptionResponse === 'string') {
            response.status(status).json({
                statusCode: status,
                message: exceptionResponse,
            });

            return;
        }

        response.status(status).json(exceptionResponse);
    }
}