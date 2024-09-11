CREATE DATABASE trabahadoor;


CREATE TYPE usertype_enum AS ENUM ('jobseeker', 'employer', 'admin');


CREATE TYPE gender AS ENUM ('Male', 'Female', 'Others');


CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  usertype usertype_enum NOT NULL
);
--ALTER TABLE users RENAME COLUMN id TO userid;
--ALTER TABLE your_table_name
--ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;


-- CREATE TABLE job_seeker (
--   jsid SERIAL PRIMARY KEY,
--   full_name VARCHAR(255) NOT NULL,
--   phone_number VARCHAR(20) NOT NULL,
--   email VARCHAR(255) NOT NULL,
--   date_of_birth DATE,
--   gender gender NOT NULL,
--   address VARCHAR(255),
--   job_title VARCHAR(255) NOT NULL,
--   salary VARCHAR(50),
--   company VARCHAR(255) NOT NULL,
--   location VARCHAR(255) NOT NULL,
--   start_date DATE,
--   end_date DATE,
--   description TEXT,
--   skills TEXT,
--   user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE
-- );


CREATE TABLE emp_profiles (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    contact_number VARCHAR(20),
    email VARCHAR(255) UNIQUE,
    website VARCHAR(255),
    industry VARCHAR(255),
    company_address TEXT,
    company_size VARCHAR(50),
    founded_year INTEGER,
    description TEXT,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE
);


CREATE TABLE job_seekers (
    jsid SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    address TEXT
);


-- Job Experience Table
CREATE TABLE job_experience (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    job_title VARCHAR(255) NOT NULL,
    salary VARCHAR(50),
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT
);


-- JS Skills Table
CREATE TABLE js_skills (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    skill_name VARCHAR(255) NOT NULL
);


--Jobtitle posting

CREATE TABLE JobListings (
    JobID SERIAL PRIMARY KEY,
    JobTitle VARCHAR(255) NOT NULL,
    Industry VARCHAR(255) NOT NULL,
    Skills VARCHAR(255) NOT NULL,
    SalaryRange VARCHAR(20) CHECK (SalaryRange IN ('Below 15000', '15001-25000', '25001-35000', '35001-50000', '50001-75000', '75001-100000', 'Above 100000')),
    EmploymentType VARCHAR(20) CHECK (EmploymentType IN ('Full-time', 'Part-time', 'work from home')),
    Responsibilities TEXT,
    JobDescription TEXT, 
    Qualifications TEXT,
    DateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DateFilled TIMESTAMP
);



-- CREATE TABLE WorkExp (
--     WorkExpID SERIAL PRIMARY KEY,
--     SeekerID INT REFERENCES JobSeeker(SeekerID),
--     Title VARCHAR(255),
--     Salary INT,
--     Company VARCHAR(255),
--     Location VARCHAR(255),
--     StartDate DATE,
--     EndDate DATE,
--     Description TEXT,
--     Skills TEXT
-- );


-- CREATE TABLE JobListing (
--     JobID SERIAL PRIMARY KEY,
--     EmployerID INT REFERENCES Employer(EmployerID),
--     JobTitle VARCHAR(255),
--     Description TEXT,
--     Qualification TEXT,
--     Responsibility TEXT,
--     Salary INT,
--     EmploymentType VARCHAR(50),
--     Categories TEXT,
--     Skills TEXT,
--     DatePosted DATE,
--     DateFilled DATE
-- );


-- CREATE TABLE Application (
--     ApplicationID SERIAL PRIMARY KEY,
--     JobID INT REFERENCES JobListing(JobID),
--     SeekerID INT REFERENCES JobSeeker(SeekerID),
--     Info TEXT,
--     Status VARCHAR(50)
-- );


