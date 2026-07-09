import { ApplicationStatus } from "./enums/application-status.enum";

export class Application {
    id: number;
    candidateId: number;
    jobOfferId: number;
    resumeId: number;
    coverLetter: string;
    status: ApplicationStatus;
    sentAt: Date;
}