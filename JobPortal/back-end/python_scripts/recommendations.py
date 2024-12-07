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
            'company_name': job.get('company_name', 'Unknown Company'),
            'industry_name': job.get('industry_name', 'Unknown Industry'),
            'job_title': job.get('job_title', 'Unknown Title'),
            'salaryrange': job.get('salaryrange', 'Unknown Salary'),
            'jobtype': job.get('jobtype', 'Unknown Job Type'),
            'profile_picture_url': job.get('profile_picture_url', 'Unknown Picture'),
        })
    return job_info


def match_skills_and_titles(job, skills_set, job_titles_set, jobseeker_education_set=None):
    """Stage 2: Check for skill, title, and education matches."""
    job_skills = set(job.get('required_skills', []))
    title_match = bool(job['job_title'] in job_titles_set)
    skill_match = bool(len(skills_set.intersection(job_skills)) > 0)

    education_match = False
    if jobseeker_education_set is not None:
        job_education = set(job.get('education', []))
        education_match = bool(len(job_education.intersection(jobseeker_education_set)) > 0)

    return skill_match, title_match, education_match


def check_salary_match(job, jobseeker_salary):
    """Check if salary matches."""
    return bool(
        any(
            user_salary == job['salaryrange']
            for user_salary in jobseeker_salary
        )
    ) if jobseeker_salary else False


def check_collaborative_filtering(job, collaborative_filtering_jobs):
    """Check if job is in the list of jobs applied to by similar jobseekers."""
    return job['job_id'] in collaborative_filtering_jobs


def generate_recommendation(job, overall_match_score, industry_match, collaborative_match):
    """Generate a job recommendation."""
    return {
        'job_title': job['job_title'],
        'company_name': job['company_name'],
        'industry_name': job['industry_name'],
        'overall_match_score': overall_match_score,
        'job_id': job['job_id'],
        'salaryrange': job['salaryrange'],
        'jobtype': job['jobtype'],
        'profile_picture_url': job['profile_picture_url'],
        'industry_match': industry_match,
        'collaborative_match': collaborative_match,
        'match_type': 'hybrid' if collaborative_match else 'content',
    }


def calculate_weighted_match_score(skill_match, title_match, education_match, salary_match, collaborative_match):
    """Calculate weighted match score."""
    weights = {
        'skills': 3,      # Skills match has the highest weight
        'title': 2,       # Job title match has moderate weight
        'education': 1,   # Education match has low weight
        'salary': 1,      # Salary match has low weight
        'collaborative': 1,  # Collaborative filtering match has low weight
    }
    
    match_score = 0
    match_score += weights['skills'] * skill_match
    match_score += weights['title'] * title_match
    match_score += weights['education'] * education_match
    match_score += weights['salary'] * salary_match
    match_score += weights['collaborative'] * collaborative_match

    return match_score


def calculate_match_percentage(recommendations):
    """Calculate the percentage of the most matches based on overall match score."""
    if not recommendations:
        return recommendations  # Return as-is if no recommendations

    max_match_score = max(rec['overall_match_score'] for rec in recommendations)

    # Avoid division by zero and calculate percentage for all recommendations
    for rec in recommendations:
        rec['match_percentage'] = round((rec['overall_match_score'] / max_match_score) * 100, 2) if max_match_score > 0 else 0.0

    return recommendations


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
            if 'applied_jobs' in jobseeker:
                for job in jobseeker['applied_jobs']:
                    if isinstance(job, dict) and 'job_id' in job:
                        collaborative_filtering_jobs.add(int(job['job_id']))

    # Iterate through job data
    for job in job_info:
        skill_match, title_match, education_match = match_skills_and_titles(job, skills_set, job_titles_set, jobseeker_education_set)

        # Check for salary match
        salary_match = check_salary_match(job, jobseeker_salary)

        # Check collaborative filtering match
        collaborative_match = check_collaborative_filtering(job, collaborative_filtering_jobs)

        # Calculate the overall weighted match score
        overall_match_score = calculate_weighted_match_score(skill_match, title_match, education_match, salary_match, collaborative_match)

        # Only add recommendation if there's a match in any criteria
        if overall_match_score > 0:
            industry_match = bool(job['industry_name'] == jobseeker_industry) if jobseeker_industry else False

            recommendations.append(
                generate_recommendation(
                    job,
                    overall_match_score,
                    industry_match,
                    collaborative_match,
                )
            )

    # Calculate percentages based on overall match score
    recommendations = calculate_match_percentage(recommendations)

    # Sort recommendations based on priority
    recommendations.sort(
        key=lambda x: (
            x['match_type'] == 'hybrid',  # Hybrid matches
            x['overall_match_score'],  # Overall match score
            x['industry_match'],  # Industry match
            x['collaborative_match'],  # Collaborative match
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
        recommendations = recommend_jobs(job_data, skills, jobseeker_industry, job_titles, similar_jobseekers, jobseeker_salary, jobseeker_education)

        # Only print the recommendations JSON to stdout
        print(json.dumps(recommendations))

    except Exception as e:
        # Print errors to stderr
        print(json.dumps({"error": str(e)}), file=sys.stderr)
