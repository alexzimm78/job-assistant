import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Resume } from './resume.entity';

@Controller('resumes')
export class ResumeController {

    @Get()
    getAll(): Resume[] {
        const resume = new Resume();

        resume.id = 1;
        resume.candidateId = 1;
        resume.title = 'AI Engineer';
        resume.skills = ['TypeScript', 'NestJS', 'Python'];
        resume.experience = '2 years';

        return [resume];
    }

    @Get(':id')
    getById(@Param('id') id: string): Resume {

        const resume = new Resume();

        resume.id = Number(id);
        resume.candidateId = 1;
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