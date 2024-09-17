CREATE DATABASE trabahadoor;


CREATE TYPE usertype_enum AS ENUM ('jobseeker', 'employer', 'admin');


CREATE TYPE gender AS ENUM ('Male', 'Female', 'Others');


CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  usertype usertype_enum NOT NULL
);

CREATE TABLE emp_profiles (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    contact_number VARCHAR(20),
    email VARCHAR(255) UNIQUE,
    website VARCHAR(255),
    industry_id INT,
    company_address TEXT,
    company_size VARCHAR(50),
    founded_year INTEGER,
    description TEXT,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (industry_id) REFERENCES industries(industry_id) ON DELETE CASCADE; 
);


CREATE TABLE job_seekers (
  jsid SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  full_name VARCHAR(255),
  phone_number VARCHAR(50),
  email VARCHAR(255),
  date_of_birth DATE,
  gender VARCHAR(50),
  address_id INT,
  industry_id INT, 
  FOREIGN KEY (address_id) REFERENCES address(address_id) ON DELETE CASCADE,
  FOREIGN KEY (industry_id) REFERENCES industries(industry_id) ON DELETE CASCADE; 
);


-- Job Experience Table
CREATE TABLE job_experience (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    jobtitle_id INTEGER NOT NULL,
    salary VARCHAR(50),
    company VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT,
	FOREIGN KEY (jobtitle_id) REFERENCES job_titles(jobtitle_id)
);


-- JS Skills Table
CREATE TABLE js_skills (
    id Serial primary key,
    Skill_id INTEGER REFERENCES skills(skill_id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
);


CREATE TABLE joblistings (
    job_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    jobtitle_id INTEGER,
    industry_id INTEGER,  -- Assuming industry_id is INTEGER in industries table
    salaryrange VARCHAR(20) CHECK (
        salaryrange IN (
            'Below 15000', 
            '15001-25000', 
            '25001-35000', 
            '35001-50000', 
            '50001-75000', 
            '75001-100000', 
            'Above 100000'
        )
    ),
    jobtype VARCHAR(20) CHECK (
        jobtype IN ('Full-time', 'Part-time', 'Work from Home')
    ),
    responsibilities TEXT,
    jobdescription TEXT,
    qualifications TEXT,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    date_filled TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (jobtitle_id) REFERENCES job_titles(jobtitle_id) ON DELETE CASCADE,
    FOREIGN KEY (industry_id) REFERENCES industries(industry_id) ON DELETE CASCADE
);



CREATE TABLE job_skills (
    job_id INTEGER NOT NULL,
    skill_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    PRIMARY KEY (job_id, skill_id),
    FOREIGN KEY (job_id) REFERENCES joblistings(job_id) ON DELETE CASCADE,
    FOREIGN KEY (skill_id) REFERENCES skills(skill_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE job_titles (
    jobtitle_id SERIAL PRIMARY KEY,
    job_title VARCHAR(255) NOT NULL
);

CREATE TABLE applications (
    application_id SERIAL PRIMARY KEY,
    job_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    additional_info TEXT,
    date_applied TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'new';
    FOREIGN KEY (job_id) REFERENCES joblistings(job_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE address (
  address_id SERIAL PRIMARY KEY,
  location VARCHAR(255) NOT NULL
);

CREATE TABLE industries (
    industry_id SERIAL PRIMARY KEY,
    industry_name VARCHAR(255) NOT NULL
);

CREATE TABLE profilepictures (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    profile_picture_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);
