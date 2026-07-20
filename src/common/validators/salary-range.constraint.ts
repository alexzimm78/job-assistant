import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

import { JobAssistantValidator } from './job-assistant.validator';

interface SalaryDto {
    salaryFrom: number;
    salaryTo: number;
}

@ValidatorConstraint({
    name: 'isValidSalaryRange',
    async: false,
})
export class SalaryRangeConstraint
    implements ValidatorConstraintInterface
{
    private readonly validator = new JobAssistantValidator();

    validate(
        salaryTo: unknown,
        args: ValidationArguments,
    ): boolean {
        const dto = args.object as SalaryDto;

        if (typeof salaryTo !== 'number') {
            return false;
        }

        return this.validator.validateSalaryRange(
            dto.salaryFrom,
            salaryTo,
        );
    }

    defaultMessage(): string {
        return 'Das Maximalgehalt darf nicht kleiner als das Mindestgehalt sein';
    }
}