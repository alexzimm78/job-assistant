import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Application } from './application.entity';
import { Candidate } from '../candidate/candidate.entity';
import { Resume } from '../resume/resume.entity';
import { JobOffer } from '../job-offer/job-offer.entity';

import { CreateApplicationDto } from './dto/create-application.dto';
import { ApplicationMapper } from './mapper/application.mapper';

@Injectable()
export class ApplicationService {
    constructor(
        @InjectRepository(Application)
        private readonly applicationRepository: Repository<Application>,

        @InjectRepository(Candidate)
        private readonly candidateRepository: Repository<Candidate>,

        @InjectRepository(Resume)
        private readonly resumeRepository: Repository<Resume>,

        @InjectRepository(JobOffer)
        private readonly jobOfferRepository: Repository<JobOffer>,
    ) {}

    async create(
        dto: CreateApplicationDto,
    ): Promise<Application> {
        const candidate =
            await this.candidateRepository.findOneBy({
                id: dto.candidateId,
            });

        if (!candidate) {
            throw new NotFoundException(
                `Candidate with ID ${dto.candidateId} not found`,
            );
        }

        const resume =
            await this.resumeRepository.findOneBy({
                id: dto.resumeId,
            });

        if (!resume) {
            throw new NotFoundException(
                `Resume with ID ${dto.resumeId} not found`,
            );
        }

        const jobOffer =
            await this.jobOfferRepository.findOneBy({
                id: dto.jobOfferId,
            });

        if (!jobOffer) {
            throw new NotFoundException(
                `JobOffer with ID ${dto.jobOfferId} not found`,
            );
        }

        const application =
            ApplicationMapper.toEntity(
                dto,
                candidate,
                resume,
                jobOffer,
            );

        return this.applicationRepository.save(application);
    }

    findAll(): Promise<Application[]> {
        return this.applicationRepository.find({
            relations: {
                candidate: true,
                resume: true,
                jobOffer: true,
            },
        });
    }

    findById(id: number): Promise<Application | null> {
        return this.applicationRepository.findOne({
            where: { id },
            relations: {
                candidate: true,
                resume: true,
                jobOffer: true,
            },
        });
    }
}