import { Job } from './job.model';
import { Application } from './application.model';

export class ApplicationItem {
    id: number;
    job: Job;
    application: Application;
}