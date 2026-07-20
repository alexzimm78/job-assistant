# Database Schema — AI Job Assistant

## Table: candidates

- id: number, primary key
- full_name: string
- email: string
- phone: string
- city: string

## Table: resumes

- id: number, primary key
- candidate_id: number, foreign key to candidates.id
- title: string
- skills: string[]
- experience: string

## Table: job_offers

- id: number, primary key
- company_name: string
- position: string
- city: string
- salary_from: number
- salary_to: number
- employment_type: EmploymentType

## Table: applications

- id: number, primary key
- candidate_id: number, foreign key to candidates.id
- job_offer_id: number, foreign key to job_offers.id
- resume_id: number, foreign key to resumes.id
- cover_letter: string
- status: ApplicationStatus
- sent_at: Date

# Relationships

## Candidate and Resume

One candidate can have many resumes.

Relation:

- candidates.id -> resumes.candidate_id

## Candidate and Application

One candidate can create many applications.

Relation:

- candidates.id -> applications.candidate_id

## JobOffer and Application

One job offer can receive many applications.

Relation:

- job_offers.id -> applications.job_offer_id

## Resume and Application

One resume can be used in many applications.

Relation:

- resumes.id -> applications.resume_id

# Summary

- Candidate 1:N Resume
- Candidate 1:N Application
- JobOffer 1:N Application
- Resume 1:N Application