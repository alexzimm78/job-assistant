import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Resume } from './resume.entity';
import { Candidate } from '../candidate/candidate.entity';
import { ResumeController } from './resume.controller';
import { ResumeService } from './resume.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Resume,
            Candidate,
        ]),
    ],
    controllers: [ResumeController],
    providers: [ResumeService],
    exports: [ResumeService],
})
export class ResumeModule {}