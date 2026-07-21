import { NotFoundException } from '@nestjs/common';

export class CandidateNotFoundException extends NotFoundException {
    constructor(id: number) {
        super(`Candidate with id ${id} was not found`);
    }
}