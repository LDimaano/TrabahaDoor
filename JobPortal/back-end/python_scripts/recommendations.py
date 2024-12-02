import json
import sys

def extract_job_data(job_data):
    """Stage 1: Extract relevant job data."""
    job_info = []
    for job in job_data:
        job_info.append({
            'job_id': job.get('job_id'),
            'required_skills': set(job.get('required_skills', [])),
            'required_education': set(job.get('required_education', [])),
            'company_name': job.get('company_name', 'Unknown Company name'),
            'industry_name': job.get('industry_name', 'Unknown Industry'),
            'job_title': job.get('job_title', 'Unknown Title'),
            'salaryrange': job.get('salaryrange', 'unknown salary'),
            'jobtype': job.get('jobtype', 'Unknown Job Type'),
            'profile_picture_url': job.get('profile_picture_url', 'Unknown picture')
        })
    return job_info

def match_skills_and_titles(job, skills_set, job_titles_set):
    """Stage 2: Check for skill and title matches."""
    job_skills = job.get('required_skills', set())
    title_match = job['job_title'] in job_titles_set
    skill_match = len(skills_set.intersection(job_skills)) > 0
    return skill_match, title_match

def match_education(job, jobseeker_education):
    """Stage 3: Check for education matches."""
    if not jobseeker_education:
        return False
    job_education = job.get('required_education', set())
    return len(jobseeker_education.intersection(job_education)) > 0

def check_salary_match(job, jobseeker_salary):
    """Check if salary matches."""
    return any(
        user_salary == job['salaryrange']
        for user_salary in jobseeker_salary
    ) if jobseeker_salary else False

def check_collaborative_filtering(job, collaborative_filtering_jobs):
    """Check if job is in the list of jobs applied to by similar jobseekers."""
    collaborative_match = job['job_id'] in collaborative_filtering_jobs
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
    jobseeker_education_set = set(jobseeker_education or [])

    # Collaborative filtering: collect job IDs applied to by similar jobseekers
    collaborative_filtering_jobs = set()
    if similar_jobseekers:
        for jobseeker in similar_jobseekers:
            for job in jobseeker.get('applied_jobs', []):
                job_id = int(job['job_id'])  # Convert job_id to integer for consistency
                collaborative_filtering_jobs.add(job_id)

    # Iterate through job data
    for job in job_info:
        skill_match, title_match = match_skills_and_titles(job, skills_set, job_titles_set)
        education_match = match_education(job, jobseeker_education_set)

        # Check for salary match
        salary_match = False
        if education_match or skill_match or title_match:
            salary_match = check_salary_match(job, jobseeker_salary)

        # Check collaborative filtering match
        collaborative_match = check_collaborative_filtering(job, collaborative_filtering_jobs)

        # Only add recommendation if there's a match in any criteria
        if education_match or skill_match or title_match or salary_match or collaborative_match:
            match_count = len(skills_set.intersection(job.get('required_skills', set())))
            industry_match = (job['industry_name'] == jobseeker_industry) if jobseeker_industry else False
            recommendations.append(generate_recommendation(job, match_count, industry_match, title_match, education_match, salary_match, collaborative_match))

    # Sort recommendations
    recommendations.sort(
        key=lambda x: (
            x['education_match'],  # Prioritize education match
            x['match_type'] == 'hybrid' and x['title_match'],  # Hybrid with title match
            x['match_type'] == 'hybrid',  # Hybrid matches
            x['match_type'] == 'content',  # Content matches
            x['salary_match'],  # Salary match
            x['title_match'],  # Title match
            x['match_count'],  # Skill match count
            x['industry_match'],  # Industry match
            not x['collaborative_match']  # Collaborative match (least priority)
        ),
        reverse=True
    )

    return recommendations

if __name__ == "__main__":
    try:
        job_data = json.loads(sys.argv[1])
        skills = json.loads(sys.argv[2])
        jobseeker_industry = sys.argv[3]
        job_titles = json.loads(sys.argv[4])
        jobseeker_salary = json.loads(sys.argv[5])
        jobseeker_education = json.loads(sys.argv[6]) if len(sys.argv) > 6 else None
        similar_jobseekers = json.loads(sys.argv[7]) if len(sys.argv) > 7 else None

        # Generate recommendations
        recommendations = recommend_jobs(job_data, skills, jobseeker_industry, job_titles, similar_jobseekers, jobseeker_salary=jobseeker_salary, jobseeker_education=jobseeker_education)

        print(json.dumps(recommendations))

    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
