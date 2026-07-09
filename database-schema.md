# AI Job Assistant Database Schema

## candidates
- id
- full_name
- email
- phone
- city

## resumes
- id
- candidate_id
- title
- skills
- experience

## job_offers
- id
- company_name
- position
- city
- salary_from
- salary_to
- employment_type

## applications
- id
- candidate_id
- job_offer_id
- resume_id
- cover_letter
- status
- sent_at

## Relations
- candidates.id → resumes.candidate_id
- candidates.id → applications.candidate_id
- job_offers.id → applications.job_offer_id
- resumes.id → applications.resume_id