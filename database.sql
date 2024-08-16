CREATE DATABASE TrabahaDoor;

CREATE TABLE users (
    UserID SERIAL PRIMARY KEY,
    Username VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    UserType VARCHAR(50) NOT NULL
);

CREATE TABLE JobSeeker (
    SeekerID SERIAL PRIMARY KEY,
    ResumeID INT,
    FullName VARCHAR(255) NOT NULL,
    PhoneNumber VARCHAR(20),
    Email VARCHAR(255) NOT NULL,
    DOB DATE,
    Gender VARCHAR(10),
    Address TEXT,
    UserID INT REFERENCES User(UserID)
);

CREATE TABLE Employer (
    EmployerID SERIAL PRIMARY KEY,
    CompanyName VARCHAR(255) NOT NULL,
    Location VARCHAR(255),
    Industry VARCHAR(255),
    DateFounded DATE,
    Description TEXT,
    UserID INT REFERENCES User(UserID)
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
