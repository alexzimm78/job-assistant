import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JobOffer } from './job-offer.entity';

@Injectable()
export class JobOfferService {
    constructor(
        @InjectRepository(JobOffer)
        private readonly jobOfferRepository: Repository<JobOffer>,
    ) {}

    findAll(): Promise<JobOffer[]> {
        return this.jobOfferRepository.find();
    }

    findById(id: number): Promise<JobOffer | null> {
        return this.jobOfferRepository.findOne({
            where: { id },
        });
    }
}