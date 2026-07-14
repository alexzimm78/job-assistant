import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {Resume} from './resume.entity';
import {Candidate} from '../candidate/candidate.entity';

@Controller('resumes')
export class ResumeController {
    @Get()
    getAll(): Resume[] {
        const candidate = new Candidate();
        candidate.id = 1;

        const resume = new Resume();
        resume.id = 1;
        resume.candidate = candidate;
        resume.title = 'AI Engineer';
        resume.skills = ['TypeScript', 'NestJS', 'Python'];
        resume.experience = '2 years';

        return [resume];
    }

    @Get(':id')
    getById(@Param('id') id: string): Resume {
        const candidate = new Candidate();
        candidate.id = 1;

        const resume = new Resume();
        resume.id = Number(id);
        resume.candidate = candidate;
        resume.title = 'AI Engineer';
        resume.skills = ['TypeScript', 'NestJS', 'Python'];
        resume.experience = '2 years';

        return resume;
    }

    @Post()
    create(@Body() resume: Resume): Resume {
        return resume;
    }
}