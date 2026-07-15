import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Candidate} from "./candidate.entity";

@Injectable()
export class CandidateService {
    constructor(
        @InjectRepository(Candidate)
        private readonly candidateRepository: Repository<Candidate>,
    ) {
    }

    findAll(): Promise<Candidate[]> {
        return this.candidateRepository.find();
    }

    findById(id: number): Promise<Candidate | null> {
        return this.candidateRepository.findOne({
            where: {id},
        });
    }
}
