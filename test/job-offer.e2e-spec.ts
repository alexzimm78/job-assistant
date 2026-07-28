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

import {AppModule} from '../src/app.module';
import {EmploymentType} from '../src/job-offer/enums/employment-type.enum';
import {JobOffer} from '../src/job-offer/job-offer.entity';
import {
    createTestAdmin,
    TEST_LOGIN,
    TEST_PASSWORD,
} from './auth-test.helper';

describe('JobOfferController Integration Tests', () => {
    let app: INestApplication;
    let jobOfferRepository: Repository<JobOffer>;
    let dataSource: DataSource;

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
    });

    it('should create a job offer and save it in the database', async () => {
        // Arrange
        const dto = {
            companyName: 'OpenAI',
            position: 'AI Engineer',
            city: 'Berlin',
            salaryFrom: 50000,
            salaryTo: 70000,
            employmentType:
            EmploymentType.FULL_TIME,
        };

        // Act
        const response = await request(
            app.getHttpServer(),
        )
            .post('/job-offers')
            .auth(
                TEST_LOGIN,
                TEST_PASSWORD,
                {
                    type: 'basic',
                }
            )
            .send(dto);

        // Assert
        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
        expect(response.body.companyName).toBe(
            dto.companyName,
        );
        expect(response.body.position).toBe(
            dto.position,
        );
        expect(response.body.salaryFrom).toBe(
            dto.salaryFrom,
        );
        expect(response.body.salaryTo).toBe(
            dto.salaryTo,
        );
        expect(response.body.employmentType).toBe(
            dto.employmentType,
        );

        const savedJobOffer =
            await jobOfferRepository.findOne({
                where: {
                    id: response.body.id,
                },
            });

        expect(savedJobOffer).not.toBeNull();
        expect(savedJobOffer?.companyName).toBe(
            dto.companyName,
        );
        expect(savedJobOffer?.position).toBe(
            dto.position,
        );
    });

    it('should return an existing job offer by id', async () => {
        // Arrange
        const jobOffer =
            await jobOfferRepository.save({
                companyName: 'Tech Solutions GmbH',
                position: 'Backend Developer',
                city: 'Hamburg',
                salaryFrom: 45000,
                salaryTo: 65000,
                employmentType:
                EmploymentType.HYBRID,
            });

        // Act
        const response = await request(
            app.getHttpServer(),
        ).get(`/job-offers/${jobOffer.id}`)
            .auth(
                TEST_LOGIN,
                TEST_PASSWORD,
                {
                    type: 'basic',
                },
            )

        // Assert
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(jobOffer.id);
        expect(response.body.companyName).toBe(
            jobOffer.companyName,
        );
        expect(response.body.position).toBe(
            jobOffer.position,
        );
        expect(response.body.city).toBe(
            jobOffer.city,
        );
        expect(response.body.salaryFrom).toBe(
            jobOffer.salaryFrom,
        );
        expect(response.body.salaryTo).toBe(
            jobOffer.salaryTo,
        );
        expect(response.body.employmentType).toBe(
            jobOffer.employmentType,
        );
    });

    it('should return 400 and not save a job offer when salary range is invalid', async () => {
        // Arrange
        const invalidDto = {
            companyName: 'OpenAI',
            position: 'AI Engineer',
            city: 'Berlin',
            salaryFrom: 80000,
            salaryTo: 50000,
            employmentType:
            EmploymentType.FULL_TIME,
        };

        // Act
        const response = await request(
            app.getHttpServer(),
        )
            .post('/job-offers')
            .auth(
                TEST_LOGIN,
                TEST_PASSWORD,
                {
                    type: 'basic',
                },
            )
            .send(invalidDto);

        // Assert
        expect(response.status).toBe(400);
        expect(response.body.statusCode).toBe(400);
        expect(response.body.message).toBeInstanceOf(
            Array,
        );

        const jobOfferCount =
            await jobOfferRepository.count();

        expect(jobOfferCount).toBe(0);
    });

    it('should return 404 when job offer does not exist', async () => {
        // Arrange
        const missingJobOfferId = 999;

        // Act
        const response = await request(
            app.getHttpServer(),
        ).get(`/job-offers/${missingJobOfferId}`)
            .auth(
                TEST_LOGIN,
                TEST_PASSWORD,
                {
                    type: 'basic',
                },
            )

        // Assert
        expect(response.status).toBe(404);
        expect(response.body.statusCode).toBe(404);
        expect(response.body.message).toContain(
            missingJobOfferId.toString(),
        );

        const jobOfferCount =
            await jobOfferRepository.count();

        expect(jobOfferCount).toBe(0);
    });

    afterAll(async () => {
        await app.close();
    });
});