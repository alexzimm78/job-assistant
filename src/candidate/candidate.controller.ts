import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Candidate } from './candidate.entity';

@Controller('candidates')
export class CandidateController {
    @Get()
    getAll(): Candidate[] {
        const candidate1: Candidate = new Candidate();
        candidate1.id = 1;
        candidate1.fullName = 'Alexander Zimmermann';
        candidate1.email = 'alex@example.com';
        candidate1.phone = '+49123456789';
        candidate1.city = 'Berlin';

        const candidate2: Candidate = new Candidate();
        candidate2.id = 2;
        candidate2.fullName = 'Maria Schmidt';
        candidate2.email = 'maria@example.com';
        candidate2.phone = '+49987654321';
        candidate2.city = 'Hamburg';

        return [candidate1, candidate2];
    }

    @Get(':id')
    getById(@Param('id') id: string): Candidate {
        const candidate: Candidate = new Candidate();
        candidate.id = Number(id);
        candidate.fullName = 'Alexander Zimmermann';
        candidate.email = 'alex@example.com';
        candidate.phone = '+49123456789';
        candidate.city = 'Berlin';

        return candidate;
    }

    @Post()
    create(@Body() candidate: Candidate): Candidate {
        return candidate;
    }
}