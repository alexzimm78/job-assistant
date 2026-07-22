import { Injectable, Logger } from '@nestjs/common';
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
    private readonly logger = new Logger(CandidateService.name);

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

        const candidate: Candidate = CandidateMapper.toEntity(dto);

        const savedCandidate: Candidate =
            await this.candidateRepository.save(candidate);

        this.logger.log(
            `Candidate ${savedCandidate.id} was created`,
        );

        return savedCandidate;
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
        const candidate: Candidate = await this.findById(id);

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

        const updatedCandidate: Candidate =
            await this.candidateRepository.save(candidate);

        this.logger.log(
            `Candidate ${updatedCandidate.id} was updated`,
        );

        return updatedCandidate;
    }

    async remove(id: number): Promise<void> {
        const candidate: Candidate = await this.findById(id);

        await this.candidateRepository.remove(candidate);

        this.logger.warn(
            `Candidate ${id} was deleted`,
        );
    }
}