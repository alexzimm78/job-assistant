export class JobAssistantValidator {
    validateGermanPhone(phone: string): boolean {
        if (typeof phone !== 'string') {
            return false;
        }

        const germanPhonePattern = /^\+49[\s\d-]{7,20}$/;

        return germanPhonePattern.test(phone.trim());
    }

    validateSalaryRange(
        salaryFrom: number,
        salaryTo: number,
    ): boolean {
        if (
            typeof salaryFrom !== 'number' ||
            typeof salaryTo !== 'number'
        ) {
            return false;
        }

        return salaryTo >= salaryFrom;
    }
}