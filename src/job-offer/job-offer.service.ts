import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { JobOffer } from './job-offer.entity';
import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { JobOfferMapper } from './mapper/job-offer.mapper';

@Injectable()
export class JobOfferService {
    constructor(
        @InjectRepository(JobOffer)
        private readonly jobOfferRepository: Repository<JobOffer>,
    ) {}

    async create(
        dto: CreateJobOfferDto,
    ): Promise<JobOffer> {
        const jobOffer =
            JobOfferMapper.toEntity(dto);

        return this.jobOfferRepository.save(jobOffer);
    }

    findAll(): Promise<JobOffer[]> {
        return this.jobOfferRepository.find();
    }

    findById(id: number): Promise<JobOffer | null> {
        return this.jobOfferRepository.findOne({
            where: { id },
        });
    }
}