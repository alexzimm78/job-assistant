import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Candidate } from '../candidate/candidate.entity';
import { CandidateNotFoundException } from '../candidate/exceptions/candidate-not-found.exception';
import { JobOfferNotFoundException } from '../job-offer/exceptions/job-offer-not-found.exception';
import { JobOffer } from '../job-offer/job-offer.entity';
import { ResumeNotFoundException } from '../resume/exceptions/resume-not-found.exception';
import { Resume } from '../resume/resume.entity';
import { Application } from './application.entity';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApplicationAlreadyExistsException } from './exceptions/application-already-exists.exception';
import { ApplicationNotFoundException } from './exceptions/application-not-found.exception';
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
        const candidate: Candidate | null =
            await this.candidateRepository.findOneBy({
                id: dto.candidateId,
            });

        if (!candidate) {
            throw new CandidateNotFoundException(
                dto.candidateId,
            );
        }

        const resume: Resume | null =
            await this.resumeRepository.findOneBy({
                id: dto.resumeId,
            });

        if (!resume) {
            throw new ResumeNotFoundException(
                dto.resumeId,
            );
        }

        const jobOffer: JobOffer | null =
            await this.jobOfferRepository.findOneBy({
                id: dto.jobOfferId,
            });

        if (!jobOffer) {
            throw new JobOfferNotFoundException(
                dto.jobOfferId,
            );
        }

        const existingApplication: Application | null =
            await this.applicationRepository.findOne({
                where: {
                    candidate: {
                        id: dto.candidateId,
                    },
                    jobOffer: {
                        id: dto.jobOfferId,
                    },
                },
            });

        if (existingApplication) {
            throw new ApplicationAlreadyExistsException(
                dto.candidateId,
                dto.jobOfferId,
            );
        }

        const application: Application =
            ApplicationMapper.toEntity(
                dto,
                candidate,
                resume,
                jobOffer,
            );

        return this.applicationRepository.save(
            application,
        );
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

    async findById(id: number): Promise<Application> {
        const application: Application | null =
            await this.applicationRepository.findOne({
                where: { id },
                relations: {
                    candidate: true,
                    resume: true,
                    jobOffer: true,
                },
            });

        if (!application) {
            throw new ApplicationNotFoundException(id);
        }

        return application;
    }
}