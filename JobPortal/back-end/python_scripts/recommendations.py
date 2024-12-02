import json
import sys

def extract_job_data(job_data):
    """Stage 1: Extract relevant job data."""
    job_info = []
    for job in job_data:
        job_info.append({
            'job_id': int(job.get('job_id')),  # Ensure job_id is an integer
            'required_skills': set(job.get('required_skills', [])),
            'education': set(job.get('education', [])),
            'company_name': job.get('company_name', 'Unknown Company name'),
            'industry_name': job.get('industry_name', 'Unknown Industry'),
            'job_title': job.get('job_title', 'Unknown Title'),
            'salaryrange': job.get('salaryrange', 'unknown salary'),
            'jobtype': job.get('jobtype', 'Unknown Job Type'),
            'profile_picture_url': job.get('profile_picture_url', 'Unknown picture')
        })
    return job_info

def match_skills_and_titles(job, skills_set, job_titles_set, jobseeker_education_set=None):
    """Stage 2: Check for skill, title, and education matches."""
    job_skills = set(job.get('required_skills', []))  # Ensure it's a set
    title_match = job['job_title'] in job_titles_set
    skill_match = len(skills_set.intersection(job_skills)) > 0
    
    # Treat education matching as another form of matching
    education_match = False
    if jobseeker_education_set is not None:
        job_education = set(job.get('required_education', []))  # Ensure education is a set
        education_match = len(job_education.intersection(jobseeker_education_set)) > 0

    return skill_match, title_match, education_match

def check_salary_match(job, jobseeker_salary):
    """Check if salary matches."""
    return any(
        user_salary == job['salaryrange']
        for user_salary in jobseeker_salary
    ) if jobseeker_salary else False

def check_collaborative_filtering(job, collaborative_filtering_jobs):
    """Check if job is in the list of jobs applied to by similar jobseekers."""
    collaborative_match = job['job_id'] in collaborative_filtering_jobs  # job_id should be an integer
    return collaborative_match


def generate_recommendation(job, match_count, industry_match, title_match, education_match, salary_match, collaborative_match):
    """Generate a job recommendation."""
    return {
        'job_title': job['job_title'],
        'company_name': job['company_name'],
        'industry_name': job['industry_name'],
        'match_count': match_count,
        'job_id': job['job_id'],
        'salaryrange': job['salaryrange'],
        'jobtype': job['jobtype'],
        'profile_picture_url': job['profile_picture_url'],
        'industry_match': industry_match,
        'collaborative_match': collaborative_match,
        'title_match': title_match,
        'education_match': education_match,
        'salary_match': salary_match,
        'match_type': 'hybrid' if education_match and collaborative_match else 'content'
    }

def recommend_jobs(job_data, skills, jobseeker_industry=None, job_titles=None, similar_jobseekers=None, jobseeker_salary=None, jobseeker_education=None):
    """Main recommendation pipeline."""
    recommendations = []

    # Extract job data
    job_info = extract_job_data(job_data)
    skills_set = set(skills)
    job_titles_set = set(job_titles)
    jobseeker_education_set = set(jobseeker_education) if jobseeker_education else set()

    # Collaborative filtering: collect job IDs applied to by similar jobseekers
    collaborative_filtering_jobs = set()
    if similar_jobseekers:
        for jobseeker in similar_jobseekers:
            if 'applied_jobs' in jobseeker:  # Check if the key exists
                for job in jobseeker['applied_jobs']:
                    if isinstance(job, dict) and 'job_id' in job:  # Ensure job is a dict and has job_id
                        job_id = int(job['job_id'])  # Convert job_id to integer for consistency
                        collaborative_filtering_jobs.add(job_id)

    # Iterate through job data
    for job in job_info:
        skill_match, title_match, education_match = match_skills_and_titles(job, skills_set, job_titles_set, jobseeker_education_set)

        # Check for salary match
        salary_match = False
        if skill_match or title_match or education_match:
            salary_match = check_salary_match(job, jobseeker_salary)

        # Check collaborative filtering match
        collaborative_match = check_collaborative_filtering(job, collaborative_filtering_jobs)

        # Only add recommendation if there's a match in any criteria
        if skill_match or title_match or education_match or salary_match or collaborative_match:
            match_count = len(skills_set.intersection(job.get('required_skills', set()))) + (1 if education_match else 0)
            industry_match = (job['industry_name'] == jobseeker_industry) if jobseeker_industry else False

            recommendations.append(
                generate_recommendation(
                    job,
                    match_count,  # Now the match count includes both skills and education
                    industry_match,
                    title_match,
                    education_match,
                    salary_match,
                    collaborative_match
                )
            )

    # Sort recommendations based on priority
    recommendations.sort(
        key=lambda x: (
            x['match_type'] == 'hybrid' and x['title_match'],  # Prioritize hybrid with title match
            x['match_type'] == 'hybrid',  # Hybrid matches
            x['title_match'],  # Title match
            x['education_match'],  # Education matches
            x['match_count'],  # Skill and education matches combined
            x['salary_match'],  # Salary matches
            x['collaborative_match']  # Collaborative match (lowest priority)
        ),reverse=True
    )

    return recommendations

# Main block to execute the script with received arguments
if __name__ == "__main__":
    try:
        # Log the raw input arguments
        print('Raw input arguments:', sys.argv)

        job_data = json.loads(sys.argv[1])
        skills = json.loads(sys.argv[2])
        education = json.loads(sys.argv[3])
        industry = json.loads(sys.argv[4])
        job_titles = json.loads(sys.argv[5])
        salary_range = json.loads(sys.argv[6]) if len(sys.argv) > 6 else None
        similar_job_seekers = json.loads(sys.argv[7]) if len(sys.argv) > 7 else None

        # Log parsed arguments
        print('Parsed Job Data:', job_data)
        print('Parsed Skills:', skills)
        print('Parsed Education:', education)
        print('Parsed Industry:', industry)
        print('Parsed Job Titles:', job_titles)
        print('Parsed Salary Range:', salary_range)
        print('Parsed Similar Job Seekers:', similar_job_seekers)

        # Generate recommendations
        recommendations = recommend_jobs(
            job_data,
            skills,
            industry,
            job_titles,
            similar_job_seekers,
            salary_range,
            education
        )

        # Output the recommendations
        print(json.dumps(recommendations))

    except Exception as e:
        # Print the exception to standard error
        print('Error:', e, file=sys.stderr)
        sys.exit(1)
