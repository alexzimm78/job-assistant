import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

import { JobAssistantValidator } from './job-assistant.validator';

@ValidatorConstraint({
    name: 'isGermanPhone',
    async: false,
})
export class GermanPhoneConstraint
    implements ValidatorConstraintInterface
{
    private readonly validator = new JobAssistantValidator();

    validate(value: unknown): boolean {
        if (typeof value !== 'string') {
            return false;
        }

        return this.validator.validateGermanPhone(value);
    }

    defaultMessage(args: ValidationArguments): string {
        return `${args.property} muss eine gültige deutsche Telefonnummer sein und mit +49 beginnen`;
    }
}