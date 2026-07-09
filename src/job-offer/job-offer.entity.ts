import { EmploymentType } from "./enums/employment-type.enum";

export class JobOffer {
    id: number;
    companyName: string;
    position: string;
    city: string;
    salaryFrom: number;
    salaryTo: number;
    employmentType: EmploymentType;
}