import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { JobOffer } from './job-offer.entity';
import { JobOfferService } from './job-offer.service';

@Controller('job-offers')
export class JobOfferController {
    constructor(
        private readonly jobOfferService: JobOfferService,
    ) {}

    @Get()
    findAll(): Promise<JobOffer[]> {
        return this.jobOfferService.findAll();
    }

    @Get(':id')
    findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<JobOffer | null> {
        return this.jobOfferService.findById(id);
    }
}