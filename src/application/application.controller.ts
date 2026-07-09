import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Application } from './application.entity';
import { ApplicationStatus } from './enums/application-status.enum';

@Controller('applications')
export class ApplicationController {
    @Get()
    getAll(): Application[] {
        const application = new Application();

        application.id = 1;
        application.candidateId = 1;
        application.jobOfferId = 1;
        application.resumeId = 1;
        application.coverLetter = 'I am interested in this AI Engineer position.';
        application.status = ApplicationStatus.DRAFT;
        application.sentAt = new Date();

        return [application];
    }

    @Get(':id')
    getById(@Param('id') id: string): Application {
        const application = new Application();

        application.id = Number(id);
        application.candidateId = 1;
        application.jobOfferId = 1;
        application.resumeId = 1;
        application.coverLetter = 'I am interested in this AI Engineer position.';
        application.status = ApplicationStatus.DRAFT;
        application.sentAt = new Date();

        return application;
    }

    @Post()
    create(@Body() application: Application): Application {
        return application;
    }
}