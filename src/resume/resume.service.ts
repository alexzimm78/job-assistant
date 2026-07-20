import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Resume } from './resume.entity';
import { Candidate } from '../candidate/candidate.entity';
import { CreateResumeDto } from './dto/create-resume.dto';
import { ResumeMappers } from './mapper/resume.mappers';

@Injectable()
export class ResumeService {
    constructor(
        @InjectRepository(Resume)
        private readonly resumeRepository: Repository<Resume>,

        @InjectRepository(Candidate)
        private readonly candidateRepository: Repository<Candidate>,
    ) {}

    async create(dto: CreateResumeDto): Promise<Resume> {
        const candidate =
            await this.candidateRepository.findOneBy({
                id: dto.candidateId,
            });

        if (!candidate) {
            throw new NotFoundException(
                `Candidate with ID ${dto.candidateId} not found`,
            );
        }

        const resume = ResumeMappers.toEntity(
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

    findById(id: number): Promise<Resume | null> {
        return this.resumeRepository.findOne({
            where: { id },
            relations: {
                candidate: true,
            },
        });
    }
}