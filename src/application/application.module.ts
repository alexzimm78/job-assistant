import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Application } from './application.entity';
import { Candidate } from '../candidate/candidate.entity';
import { Resume } from '../resume/resume.entity';
import { JobOffer } from '../job-offer/job-offer.entity';

import { ApplicationController } from './application.controller';
import { ApplicationService } from './application.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Application,
            Candidate,
            Resume,
            JobOffer,
        ]),
    ],
    controllers: [ApplicationController],
    providers: [ApplicationService],
})
export class ApplicationModule {}