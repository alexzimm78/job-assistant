import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { Application } from './application.entity';
import { ApplicationStatus } from './enums/application-status.enum';
import { Candidate } from '../candidate/candidate.entity';
import { Resume } from '../resume/resume.entity';
import { JobOffer } from '../job-offer/job-offer.entity';

@Controller('applications')
export class ApplicationController {
    @Get()
    getAll(): Application[] {
        const candidate = new Candidate();
        candidate.id = 1;

        const resume = new Resume();
        resume.id = 1;

        const jobOffer = new JobOffer();
        jobOffer.id = 1;

        const application = new Application();
        application.id = 1;
        application.candidate = candidate;
        application.resume = resume;
        application.jobOffer = jobOffer;
        application.coverLetter =
            'I am interested in this AI Engineer position.';
        application.status = ApplicationStatus.DRAFT;
        application.sentAt = new Date();

        return [application];
    }

    @Get(':id')
    getById(@Param('id') id: string): Application {
        const candidate = new Candidate();
        candidate.id = 1;

        const resume = new Resume();
        resume.id = 1;

        const jobOffer = new JobOffer();
        jobOffer.id = 1;

        const application = new Application();
        application.id = Number(id);
        application.candidate = candidate;
        application.resume = resume;
        application.jobOffer = jobOffer;
        application.coverLetter =
            'I am interested in this AI Engineer position.';
        application.status = ApplicationStatus.DRAFT;
        application.sentAt = new Date();

        return application;
    }

    @Post()
    create(@Body() application: Application): Application {
        return application;
    }
}