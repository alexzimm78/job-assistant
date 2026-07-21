import { NotFoundException } from '@nestjs/common';

export class ApplicationNotFoundException extends NotFoundException {
    constructor(id: number) {
        super(`Application with id ${id} was not found`);
    }
}