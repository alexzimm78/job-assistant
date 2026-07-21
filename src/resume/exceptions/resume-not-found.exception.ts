import { NotFoundException } from '@nestjs/common';

export class ResumeNotFoundException extends NotFoundException {
    constructor(id: number) {
        super(`Resume with id ${id} was not found`);
    }
}