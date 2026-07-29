import {
    INestApplication,
    ValidationPipe,
} from '@nestjs/common';
import {
    Test,
    TestingModule,
} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import request from 'supertest';
import {
    DataSource,
    Repository,
} from 'typeorm';
import {
    createTestAdmin,
    loginTestAdmin,
} from './auth-test.helper';

import {AppModule} from '../src/app.module';
import {Application} from '../src/application/application.entity';
import {ApplicationStatus} from '../src/application/enums/application-status.enum';
import {Candidate} from '../src/candidate/candidate.entity';
import {EmploymentType} from '../src/job-offer/enums/employment-type.enum';
import {JobOffer} from '../src/job-offer/job-offer.entity';
import {Resume} from '../src/resume/resume.entity';

describe('ApplicationController Integration Tests', () => {
    let app: INestApplication;
    let applicationRepository: Repository<Application>;
    let candidateRepository: Repository<Candidate>;
    let resumeRepository: Repository<Resume>;
    let jobOfferRepository: Repository<JobOffer>;
    let dataSource: DataSource;
    let accessToken: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule =
            await Test.createTestingModule({
                imports: [AppModule],
            }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );

        applicationRepository = moduleFixture.get<
            Repository<Application>
        >(getRepositoryToken(Application));

        candidateRepository = moduleFixture.get<
            Repository<Candidate>
        >(getRepositoryToken(Candidate));

        resumeRepository = moduleFixture.get<
            Repository<Resume>
        >(getRepositoryToken(Resume));

        jobOfferRepository = moduleFixture.get<
            Repository<JobOffer>
        >(getRepositoryToken(JobOffer));

        dataSource = moduleFixture.get(DataSource);

        await app.init();
    });

    beforeEach(async () => {
        await dataSource.query(`
            TRUNCATE TABLE
                applications,
                resumes,
                job_offers,
                candidates,
                users
            RESTART IDENTITY CASCADE
        `);

        await createTestAdmin(dataSource);

        accessToken =
            await loginTestAdmin(app);
    });

    async function createRelatedEntities() {
        const candidate =
            await candidateRepository.save({
                fullName: 'Alexander Zimmermann',
                email: 'alexander@example.com',
                phone: '+49123456789',
                city: 'Berlin',
            });

        const resume = await resumeRepository.save({
            candidate,
            title: 'AI Engineer Resume',
            skills: [
                'TypeScript',
                'NestJS',
                'PostgreSQL',
            ],
            experience: '2 years',
        });

        const jobOffer =
            await jobOfferRepository.save({
                companyName: 'OpenAI',
                position: 'AI Engineer',
                city: 'Berlin',
                salaryFrom: 50000,
                salaryTo: 70000,
                employmentType:
                EmploymentType.FULL_TIME,
            });

        return {
            candidate,
            resume,
            jobOffer,
        };
    }

    it('should create an application and save it in the database', async () => {
        // Arrange
        const {
            candidate,
            resume,
            jobOffer,
        } = await createRelatedEntities();

        const dto = {
            candidateId: candidate.id,
            resumeId: resume.id,
            jobOfferId: jobOffer.id,
            coverLetter:
                'Sehr geehrte Damen und Herren, hiermit bewerbe ich mich auf die Stelle.',
            status: ApplicationStatus.SENT,
            sentAt: '2026-07-27T10:00:00.000Z',
        };

        // Act
        const response = await request(
            app.getHttpServer(),
        )
            .post('/applications')
            .set(
                'Authorization',
                `Bearer ${accessToken}`,
            )
            .send(dto);

        // Assert
        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
        expect(response.body.candidateId).toBe(
            candidate.id,
        );
        expect(response.body.resumeId).toBe(
            resume.id,
        );
        expect(response.body.jobOfferId).toBe(
            jobOffer.id,
        );
        expect(response.body.coverLetter).toBe(
            dto.coverLetter,
        );
        expect(response.body.status).toBe(
            dto.status,
        );
        expect(response.body.sentAt).toBe(
            dto.sentAt,
        );

        const savedApplication =
            await applicationRepository.findOne({
                where: {
                    id: response.body.id,
                },
                relations: {
                    candidate: true,
                    resume: true,
                    jobOffer: true,
                },
            });

        expect(savedApplication).not.toBeNull();
        expect(savedApplication?.candidate.id).toBe(
            candidate.id,
        );
        expect(savedApplication?.resume.id).toBe(
            resume.id,
        );
        expect(savedApplication?.jobOffer.id).toBe(
            jobOffer.id,
        );
        expect(savedApplication?.status).toBe(
            ApplicationStatus.SENT,
        );
    });

    it('should return an existing application by id', async () => {
        // Arrange
        const {
            candidate,
            resume,
            jobOffer,
        } = await createRelatedEntities();

        const application =
            await applicationRepository.save({
                candidate,
                resume,
                jobOffer,
                coverLetter:
                    'Sehr geehrte Damen und Herren, hiermit sende ich Ihnen meine Bewerbung.',
                status: ApplicationStatus.DRAFT,
                sentAt: new Date(
                    '2026-07-27T11:00:00.000Z',
                ),
            });

        // Act
        const response = await request(
            app.getHttpServer(),
        ).get(`/applications/${application.id}`)
            .set(
                'Authorization',
                `Bearer ${accessToken}`,
            )

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(
            application.id,
        );
        expect(response.body.candidateId).toBe(
            candidate.id,
        );
        expect(response.body.resumeId).toBe(
            resume.id,
        );
        expect(response.body.jobOfferId).toBe(
            jobOffer.id,
        );
        expect(response.body.coverLetter).toBe(
            application.coverLetter,
        );
        expect(response.body.status).toBe(
            ApplicationStatus.DRAFT,
        );
    });

    it('should return 404 and not save an application when candidate does not exist', async () => {
        // Arrange
        const {
            resume,
            jobOffer,
        } = await createRelatedEntities();

        const dto = {
            candidateId: 999,
            resumeId: resume.id,
            jobOfferId: jobOffer.id,
            coverLetter:
                'Sehr geehrte Damen und Herren, hiermit bewerbe ich mich auf die Stelle.',
            status: ApplicationStatus.SENT,
            sentAt: '2026-07-27T10:00:00.000Z',
        };

        // Act
        const response = await request(
            app.getHttpServer(),
        )
            .post('/applications')
            .set(
                'Authorization',
                `Bearer ${accessToken}`,
            )
            .send(dto);

        // Assert
        expect(response.status).toBe(404);
        expect(response.body.statusCode).toBe(404);
        expect(response.body.message).toContain(
            '999',
        );

        const applicationCount =
            await applicationRepository.count();

        expect(applicationCount).toBe(0);
    });

    it('should return 409 and not create a duplicate application', async () => {
        // Arrange
        const {
            candidate,
            resume,
            jobOffer,
        } = await createRelatedEntities();

        await applicationRepository.save({
            candidate,
            resume,
            jobOffer,
            coverLetter:
                'Erste Bewerbung für dieses Stellenangebot.',
            status: ApplicationStatus.SENT,
            sentAt: new Date(
                '2026-07-27T10:00:00.000Z',
            ),
        });

        const duplicateDto = {
            candidateId: candidate.id,
            resumeId: resume.id,
            jobOfferId: jobOffer.id,
            coverLetter:
                'Zweite Bewerbung für dasselbe Stellenangebot.',
            status: ApplicationStatus.SENT,
            sentAt: '2026-07-27T12:00:00.000Z',
        };

        // Act
        const response = await request(
            app.getHttpServer(),
        )
            .post('/applications')
            .set(
                'Authorization',
                `Bearer ${accessToken}`,
            )
            .send(duplicateDto);

        // Assert
        expect(response.status).toBe(409);
        expect(response.body.statusCode).toBe(409);
        expect(response.body.message).toContain(
            candidate.id.toString(),
        );
        expect(response.body.message).toContain(
            jobOffer.id.toString(),
        );

        const applications =
            await applicationRepository.find();

        expect(applications).toHaveLength(1);
        expect(applications[0].coverLetter).toBe(
            'Erste Bewerbung für dieses Stellenangebot.',
        );
    });

    afterAll(async () => {
        await app.close();
    });
});