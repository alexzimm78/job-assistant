import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Candidate } from './candidate.entity';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { CandidateAlreadyExistsException } from './exceptions/candidate-already-exists.exception';
import { CandidateNotFoundException } from './exceptions/candidate-not-found.exception';
import { CandidateMapper } from './mapper/candidate.mapper';

@Injectable()
export class CandidateService {
    constructor(
        @InjectRepository(Candidate)
        private readonly candidateRepository: Repository<Candidate>,
    ) {}

    async create(dto: CreateCandidateDto): Promise<Candidate> {
        const existingCandidate: Candidate | null =
            await this.candidateRepository.findOne({
                where: { email: dto.email },
            });

        if (existingCandidate) {
            throw new CandidateAlreadyExistsException(dto.email);
        }

        const candidate: Candidate =
            CandidateMapper.toEntity(dto);

        return this.candidateRepository.save(candidate);
    }

    findAll(): Promise<Candidate[]> {
        return this.candidateRepository.find();
    }

    async findById(id: number): Promise<Candidate> {
        const candidate: Candidate | null =
            await this.candidateRepository.findOne({
                where: { id },
            });

        if (!candidate) {
            throw new CandidateNotFoundException(id);
        }

        return candidate;
    }

    async update(
        id: number,
        dto: UpdateCandidateDto,
    ): Promise<Candidate> {
        const candidate: Candidate =
            await this.findById(id);

        if (dto.email && dto.email !== candidate.email) {
            const existingCandidate: Candidate | null =
                await this.candidateRepository.findOne({
                    where: {
                        email: dto.email,
                    },
                });

            if (existingCandidate) {
                throw new CandidateAlreadyExistsException(
                    dto.email,
                );
            }
        }

        this.candidateRepository.merge(candidate, dto);

        return this.candidateRepository.save(candidate);
    }

    async remove(id: number): Promise<void> {
        const candidate: Candidate =
            await this.findById(id);

        await this.candidateRepository.remove(candidate);
    }
}