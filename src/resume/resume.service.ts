import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Candidate } from '../candidate/candidate.entity';
import { CandidateNotFoundException } from '../candidate/exceptions/candidate-not-found.exception';
import { CreateResumeDto } from './dto/create-resume.dto';
import { UpdateResumeDto } from './dto/update-resume.dto';
import { ResumeNotFoundException } from './exceptions/resume-not-found.exception';
import { ResumeMappers } from './mapper/resume.mappers';
import { Resume } from './resume.entity';

@Injectable()
export class ResumeService {
    private readonly logger = new Logger(ResumeService.name);

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

        const savedResume: Resume =
            await this.resumeRepository.save(resume);

        this.logger.log(
            `Resume ${savedResume.id} was created`,
        );

        return savedResume;
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

    async update(
        id: number,
        dto: UpdateResumeDto,
    ): Promise<Resume> {
        const resume: Resume = await this.findById(id);

        if (dto.candidateId !== undefined) {
            const candidate: Candidate | null =
                await this.candidateRepository.findOneBy({
                    id: dto.candidateId,
                });

            if (!candidate) {
                throw new CandidateNotFoundException(
                    dto.candidateId,
                );
            }

            resume.candidate = candidate;
        }

        if (dto.title !== undefined) {
            resume.title = dto.title;
        }

        if (dto.skills !== undefined) {
            resume.skills = dto.skills;
        }

        if (dto.experience !== undefined) {
            resume.experience = dto.experience;
        }

        const updatedResume: Resume =
            await this.resumeRepository.save(resume);

        this.logger.log(
            `Resume ${updatedResume.id} was updated`,
        );

        return updatedResume;
    }

    async remove(id: number): Promise<void> {
        const resume: Resume = await this.findById(id);

        await this.resumeRepository.remove(resume);

        this.logger.warn(
            `Resume ${id} was deleted`,
        );
    }
}