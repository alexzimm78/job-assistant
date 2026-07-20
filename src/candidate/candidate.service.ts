import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Candidate } from './candidate.entity';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { CandidateMapper } from './mapper/candidate.mapper';

@Injectable()
export class CandidateService {
    constructor(
        @InjectRepository(Candidate)
        private readonly candidateRepository: Repository<Candidate>,
    ) {}

    async create(
        dto: CreateCandidateDto,
    ): Promise<Candidate> {
        const candidate =
            CandidateMapper.toEntity(dto);

        return this.candidateRepository.save(candidate);
    }

    findAll(): Promise<Candidate[]> {
        return this.candidateRepository.find();
    }

    findById(id: number): Promise<Candidate | null> {
        return this.candidateRepository.findOne({
            where: { id },
        });
    }
}