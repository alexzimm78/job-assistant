import {Module} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";

import {Candidate} from "./candidate.entity";
import {CandidateController} from "./candidate.controller";
import { CandidateService } from './candidate.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Candidate]),
    ],
    controllers: [CandidateController],
    providers: [CandidateService],
})
export class CandidateModule {}
