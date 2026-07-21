import { ConflictException } from '@nestjs/common';

export class CandidateAlreadyExistsException extends ConflictException {
    constructor(email: string) {
        super(`Candidate with email ${email} already exists`);
    }
}