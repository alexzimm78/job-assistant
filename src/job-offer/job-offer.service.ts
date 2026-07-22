import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateJobOfferDto } from './dto/create-job-offer.dto';
import { UpdateJobOfferDto } from './dto/update-job-offer.dto';
import { InvalidSalaryRangeException } from './exceptions/invalid-salary-range.exception';
import { JobOfferNotFoundException } from './exceptions/job-offer-not-found.exception';
import { JobOffer } from './job-offer.entity';
import { JobOfferMapper } from './mapper/job-offer.mapper';

@Injectable()
export class JobOfferService {
    private readonly logger = new Logger(JobOfferService.name);

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

        const savedJobOffer: JobOffer =
            await this.jobOfferRepository.save(jobOffer);

        this.logger.log(
            `Job offer ${savedJobOffer.id} was created`,
        );

        return savedJobOffer;
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

    async update(
        id: number,
        dto: UpdateJobOfferDto,
    ): Promise<JobOffer> {
        const jobOffer: JobOffer =
            await this.findById(id);

        const salaryFrom: number =
            dto.salaryFrom ?? jobOffer.salaryFrom;

        const salaryTo: number =
            dto.salaryTo ?? jobOffer.salaryTo;

        if (salaryFrom > salaryTo) {
            throw new InvalidSalaryRangeException(
                salaryFrom,
                salaryTo,
            );
        }

        this.jobOfferRepository.merge(jobOffer, dto);

        const updatedJobOffer: JobOffer =
            await this.jobOfferRepository.save(jobOffer);

        this.logger.log(
            `Job offer ${updatedJobOffer.id} was updated`,
        );

        return updatedJobOffer;
    }

    async remove(id: number): Promise<void> {
        const jobOffer: JobOffer =
            await this.findById(id);

        await this.jobOfferRepository.remove(jobOffer);

        this.logger.warn(
            `Job offer ${id} was deleted`,
        );
    }
}