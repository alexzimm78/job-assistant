import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { JobOffer } from './job-offer.entity';

@Controller('job-offers')
export class JobOfferController {

    @Get()
    getAll(): JobOffer[] {
        const job: JobOffer = new JobOffer();
        job.id = 1;
        job.companyName = 'OpenAI';
        job.position = 'AI Engineer';
        job.city = 'Berlin';
        job.salaryFrom = 5000;
        job.salaryTo = 7000;

        return [job];
    }

    @Get(':id')
    getById(@Param('id') id: string): JobOffer {
        const job: JobOffer = new JobOffer();
        job.id = Number(id);
        job.companyName = 'OpenAI';
        job.position = 'AI Engineer';
        job.city = 'Berlin';
        job.salaryFrom = 5000;
        job.salaryTo = 7000;

        return job;
    }

    @Post()
    create(@Body() job: JobOffer): JobOffer {
        return job;
    }
}