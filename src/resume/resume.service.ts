import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Candidate } from '../candidate/candidate.entity';
import { CandidateNotFoundException } from '../candidate/exceptions/candidate-not-found.exception';
import { CreateResumeDto } from './dto/create-resume.dto';
import { ResumeNotFoundException } from './exceptions/resume-not-found.exception';
import { ResumeMappers } from './mapper/resume.mappers';
import { Resume } from './resume.entity';

@Injectable()
export class ResumeService {
    constructor(
        @InjectRepository(Resume)
        private readonly resumeRepository: Repository<Resume>,

        @InjectRepository(Candidate)
        private readonly candidateRepository: Repository<Candidate>,
    ) {}

    async create(dto: CreateResumeDto): Promise<Resume> {
        const candidate: Candidate | null =
            await this.candidateRepository.findOneBy({
                id: dto.candidateId,
            });

        if (!candidate) {
            throw new CandidateNotFoundException(
                dto.candidateId,
            );
        }

        const resume: Resume = ResumeMappers.toEntity(
            dto,
            candidate,
        );

        return this.resumeRepository.save(resume);
    }

    findAll(): Promise<Resume[]> {
        return this.resumeRepository.find({
            relations: {
                candidate: true,
            },
        });
    }

    async findById(id: number): Promise<Resume> {
        const resume: Resume | null =
            await this.resumeRepository.findOne({
                where: { id },
                relations: {
                    candidate: true,
                },
            });

        if (!resume) {
            throw new ResumeNotFoundException(id);
        }

        return resume;
    }
}