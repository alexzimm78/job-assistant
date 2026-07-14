import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppController} from './app.controller';
import {AppService} from './app.service';

import { CandidateModule } from './candidate/candidate.module';
import { ResumeModule } from './resume/resume.module';
import { JobOfferModule } from './job-offer/job-offer.module';
import { ApplicationModule } from './application/application.module';


@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'qwerty123',
            database: 'job_Assistant_db',
            autoLoadEntities: true,
            synchronize: true,
        }),
        CandidateModule,
        ResumeModule,
        JobOfferModule,
        ApplicationModule,
    ],
    controllers: [AppController],

    providers: [AppService],
})
export class AppModule {
}