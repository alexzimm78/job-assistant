import { ConflictException } from '@nestjs/common';

export class ApplicationAlreadyExistsException extends ConflictException {
    constructor(candidateId: number, jobOfferId: number) {
        super(
            `Candidate with id ${candidateId} has already applied for job offer with id ${jobOfferId}`,
        );
    }
}