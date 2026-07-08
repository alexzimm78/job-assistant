import {Candidate} from './candidate.model';
import {ApplicationItem} from './application-item.model';

export class Application {
    id: number;
    candidate: Candidate;
    items: ApplicationItem[];
    status: string;
}