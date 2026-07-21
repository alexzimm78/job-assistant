import { NotFoundException } from '@nestjs/common';

export class JobOfferNotFoundException extends NotFoundException {
    constructor(id: number) {
        super(`Job offer with id ${id} was not found`);
    }
}