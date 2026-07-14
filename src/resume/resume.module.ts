import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Resume} from "./resume.entity";
import {ResumeController} from "./resume.controller";
import { ResumeService } from './resume.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([Resume]),
    ],
    controllers: [ResumeController],
    providers: [ResumeService],
})
export class ResumeModule {}
