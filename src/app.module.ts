import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {CandidateController} from './candidate/candidate.controller';
import {ResumeController} from './resume/resume.controller';
import {JobOfferController} from './job-offer/job-offer.controller';
import {ApplicationController} from './application/application.controller';

@Module({
    imports: [],
    controllers: [AppController, CandidateController, ResumeController, JobOfferController, ApplicationController],
    providers: [AppService],
})
export class AppModule {
}