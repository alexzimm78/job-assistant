import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { InvalidSalaryRangeException } from './exceptions/invalid-salary-range.exception';
import { JobOfferNotFoundException } from './exceptions/job-offer-not-found.exception';
import { JobOffer } from './job-offer.entity';
import { JobOfferMapper } from './mapper/job-offer.mapper';

@Injectable()
export class JobOfferService {
    constructor(
        @InjectRepository(JobOffer)
        private readonly jobOfferRepository: Repository<JobOffer>,
    ) {}

    async create(dto: CreateJobOfferDto): Promise<JobOffer> {
        if (dto.salaryFrom > dto.salaryTo) {
            throw new InvalidSalaryRangeException(
                dto.salaryFrom,
                dto.salaryTo,
            );
        }

        const jobOffer: JobOffer =
            JobOfferMapper.toEntity(dto);

        return this.jobOfferRepository.save(jobOffer);
    }

    findAll(): Promise<JobOffer[]> {
        return this.jobOfferRepository.find();
    }

    async findById(id: number): Promise<JobOffer> {
        const jobOffer: JobOffer | null =
            await this.jobOfferRepository.findOne({
                where: { id },
            });

        if (!jobOffer) {
            throw new JobOfferNotFoundException(id);
        }

        return jobOffer;
    }
}