import { BadRequestException } from '@nestjs/common';

export class InvalidSalaryRangeException extends BadRequestException {
    constructor(salaryFrom: number, salaryTo: number) {
        super(
            `Salary from ${salaryFrom} cannot be greater than salary to ${salaryTo}`,
        );
    }
}