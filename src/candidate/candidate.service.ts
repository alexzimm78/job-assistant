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

}
