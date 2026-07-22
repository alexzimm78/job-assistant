import {
    CallHandler,
    ExecutionContext,
    Injectable,
    Logger,
    NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    private readonly logger = new Logger(LoggingInterceptor.name);

    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<unknown> {
        const controllerName = context.getClass().name;
        const methodName = context.getHandler().name;

        this.logger.log(
            `${controllerName}.${methodName} called`,
        );

        return next.handle().pipe(
            tap(() => {
                this.logger.log(
                    `${controllerName}.${methodName} completed`,
                );
            }),
        );
    }
}