import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppController} from './app.controller';
import {AppService} from './app.service';

import {CandidateModule} from './candidate/candidate.module';
import {ResumeModule} from './resume/resume.module';
import {JobOfferModule} from './job-offer/job-offer.module';
import {ApplicationModule} from './application/application.module';
import {UserModule} from "./user/user.module";
import {AuthModule} from "./auth/auth.module";
import {APP_GUARD} from "@nestjs/core";
import {AuthGuard} from "./auth/guards/auth.guard";
import {RolesGuard} from "./auth/guards/roles.guard";


@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'qwerty123',
            database:
                process.env.NODE_ENV === 'test'
                    ? 'job_assistant_test'
                    : 'job_Assistant_db',
            autoLoadEntities: true,
            synchronize: true,
        }),
        CandidateModule,
        ResumeModule,
        JobOfferModule,
        ApplicationModule,
        UserModule,
        AuthModule,
    ],
    controllers: [AppController],

    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        },
    ],
})
export class AppModule {
}
