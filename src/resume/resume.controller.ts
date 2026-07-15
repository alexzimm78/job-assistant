import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { Resume } from './resume.entity';
import { ResumeService } from './resume.service';

@Controller('resumes')
export class ResumeController {
    constructor(
        private readonly resumeService: ResumeService,
    ) {}

    @Get()
    findAll(): Promise<Resume[]> {
        return this.resumeService.findAll();
    }

    @Get(':id')
    findById(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Resume | null> {
        return this.resumeService.findById(id);
    }
}