import json
import sys

# Define weights for each matching criterion
MATCH_WEIGHTS = {
    'skill_match': 0.4,         # 40% weight for skills match
    'title_match': 0.3,         # 30% weight for job title match
    'education_match': 0.1,     # 10% weight for education match
    'salary_match': 0.1,        # 10% weight for salary match
    'collaborative_match': 0.1  # 10% weight for collaborative match
}
TOTAL_WEIGHT = sum(MATCH_WEIGHTS.values())  # Total possible score (1.0)


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


def generate_recommendation(job, matches, industry_match):
    """Generate a job recommendation with overall score."""
    # Calculate the weighted score
    score = sum(matches[match] * MATCH_WEIGHTS[match] for match in MATCH_WEIGHTS)
    match_percentage = round((score / TOTAL_WEIGHT) * 100, 2)

    return {
        'job_title': job['job_title'],
        'company_name': job['company_name'],
        'industry_name': job['industry_name'],
        'job_id': job['job_id'],
        'salaryrange': job['salaryrange'],
        'jobtype': job['jobtype'],
        'profile_picture_url': job['profile_picture_url'],
        'match_percentage': match_percentage,
        'score': score,
        'industry_match': industry_match,
        **matches,  # Include detailed matches (skill, title, etc.)
        'match_type': 'hybrid' if matches['collaborative_match'] else 'content',
    }


def calculate_match_percentage(recommendations):
    """Calculate the percentage of the most matches."""
    if not recommendations:
        return recommendations  # Return as-is if no recommendations

    max_match_count = max(rec['score'] for rec in recommendations)

    # Avoid division by zero and calculate percentage for all matches
    for rec in recommendations:
        rec['match_percentage'] = round((rec['score'] / max_match_count) * 100, 2) if max_match_count > 0 else 0.0

    return recommendations


def recommend_jobs(job_data, skills, jobseeker_industry=None, job_titles=None, similar_jobseekers=None, jobseeker_salary=None, jobseeker_education=None):
    """Main recommendation pipeline with scoring."""
    recommendations = []

    # Extract job data
    job_info = extract_job_data(job_data)
    skills_set = set(skills)
    job_titles_set = set(job_titles)
    jobseeker_education_set = set(jobseeker_education) if jobseeker_education else set()

    # Collaborative filtering: collect job IDs applied to by similar jobseekers
    collaborative_filtering_jobs = set(
        job['job_id'] for jobseeker in similar_jobseekers or [] for job in jobseeker.get('applied_jobs', [])
    )

    # Iterate through job data
    for job in job_info:
        skill_match, title_match, education_match = match_skills_and_titles(job, skills_set, job_titles_set, jobseeker_education_set)
        salary_match = check_salary_match(job, jobseeker_salary)
        collaborative_match = check_collaborative_filtering(job, collaborative_filtering_jobs)

        # Collect all matches in a dictionary
        matches = {
            'skill_match': skill_match,
            'title_match': title_match,
            'education_match': education_match,
            'salary_match': salary_match,
            'collaborative_match': collaborative_match
        }

        # Only add recommendation if there's any match
        if any(matches.values()):
            industry_match = bool(job['industry_name'] == jobseeker_industry) if jobseeker_industry else False
            recommendations.append(generate_recommendation(job, matches, industry_match))

    # Calculate percentages based on the overall score
    recommendations = calculate_match_percentage(recommendations)

    # Sort recommendations by match percentage and other criteria
    recommendations.sort(
        key=lambda x: (x['match_percentage'], x['match_type'] == 'hybrid', x['title_match']),
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
