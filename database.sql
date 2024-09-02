CREATE DATABASE trabahadoor;

CREATE TYPE usertype_enum AS ENUM ('jobseeker', 'employer', 'admin');

CREATE TABLE users (
  id SERIAL PRIMARY KEY, 
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  usertype usertype_enum NOT NULL
);
--ALTER TABLE users RENAME COLUMN id TO userid;

CREATE TABLE job_seekers (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(50),
  last_name VARCHAR(50),
  location VARCHAR(100),
  job_title VARCHAR(100),
  work_type VARCHAR(50),
  salary VARCHAR(50),
  industry VARCHAR(100),
  company VARCHAR(100)
);


CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    school VARCHAR(255),
    year_level VARCHAR(255),
    specialization VARCHAR(255)
);


CREATE TABLE Employer (
    id SERIAL PRIMARY KEY,
    CompanyName VARCHAR(255) NOT NULL,
    Location VARCHAR(255) NOT NULL,
    Industry VARCHAR(255) NOT NULL,
    DateFounded DATE NOT NULL,
    Description TEXT NOT NULL,
    jobtitle VARCHAR(255) NOT NULL;
);

CREATE TABLE WorkExp (
    WorkExpID SERIAL PRIMARY KEY,
    SeekerID INT REFERENCES JobSeeker(SeekerID),
    Title VARCHAR(255),
    Salary INT,
    Company VARCHAR(255),
    Location VARCHAR(255),
    StartDate DATE,
    EndDate DATE,
    Description TEXT,
    Skills TEXT
);

CREATE TABLE JobListing (
    JobID SERIAL PRIMARY KEY,
    EmployerID INT REFERENCES Employer(EmployerID),
    JobTitle VARCHAR(255),
    Description TEXT,
    Qualification TEXT,
    Responsibility TEXT,
    Salary INT,
    EmploymentType VARCHAR(50),
    Categories TEXT,
    Skills TEXT,
    DatePosted DATE,
    DateFilled DATE
);

CREATE TABLE Application (
    ApplicationID SERIAL PRIMARY KEY,
    JobID INT REFERENCES JobListing(JobID),
    SeekerID INT REFERENCES JobSeeker(SeekerID),
    Info TEXT,
    Status VARCHAR(50)
);
