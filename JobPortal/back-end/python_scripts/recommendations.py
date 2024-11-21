import json
import sys

def extract_job_data(job_data):
    """Stage 1: Extract relevant job data."""
    job_info = []
    for job in job_data:
        job_info.append({
            'job_id': job.get('job_id'),
            'required_skills': set(job.get('required_skills', [])),
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

def check_salary_match(job, jobseeker_salary):
    """Stage 3: Check if salary matches."""
    return any(
        user_salary == job['salaryrange']
        for user_salary in jobseeker_salary
    ) if jobseeker_salary else False

def check_collaborative_filtering(job, collaborative_filtering_jobs):
    """Stage 4: Check for collaborative filtering match."""
    return job['job_id'] in collaborative_filtering_jobs

def generate_recommendation(job, match_count, industry_match, title_match, salary_match, collaborative_filtering_jobs):
    """Stage 5: Generate a job recommendation."""
    return {
        'job_title': job['job_title'],
        'industry_name': job['industry_name'],
        'match_count': match_count,
        'job_id': job['job_id'],
        'salaryrange': job['salaryrange'],
        'jobtype': job['jobtype'],
        'profile_picture_url': job['profile_picture_url'],
        'industry_match': industry_match,
        'collaborative_match': collaborative_filtering_jobs.get(job['job_id'], []),
        'title_match': title_match,
        'salary_match': salary_match,
        'match_type': 'hybrid' if (industry_match or title_match) and collaborative_filtering_jobs else 'content'
    }

def recommend_jobs(job_data, skills, jobseeker_industry=None, job_titles=None, similar_jobseekers=None, jobseeker_salary=None):
    """Main recommendation pipeline."""
    recommendations = []

    # Extract job data
    job_info = extract_job_data(job_data)
    skills_set = set(skills)
    job_titles_set = set(job_titles)

    collaborative_filtering_jobs = {}
    if similar_jobseekers:
        for jobseeker in similar_jobseekers:
            for job in jobseeker.get('applied_jobs', []):
                job_id = job['job_id']
                if job_id not in collaborative_filtering_jobs:
                    collaborative_filtering_jobs[job_id] = []
                collaborative_filtering_jobs[job_id].append(jobseeker['user_id'])

    # Iterate through job data
    for job in job_info:
        skill_match, title_match = match_skills_and_titles(job, skills_set, job_titles_set)
 
        # Check for salary match
        salary_match = False
        if skill_match or title_match:
            salary_match = check_salary_match(job, jobseeker_salary)
        
        # Check collaborative filtering match
        collaborative_match = check_collaborative_filtering(job, collaborative_filtering_jobs)
        
        # Only add recommendation if there's a match
        if skill_match or title_match or collaborative_match:
            match_count = len(skills_set.intersection(job.get('required_skills', set())))
            industry_match = (job['industry_name'] == jobseeker_industry) if jobseeker_industry else False
            recommendations.append(generate_recommendation(job, match_count, industry_match, title_match, salary_match, collaborative_filtering_jobs))

    # Sort recommendations
    recommendations.sort(
        key=lambda x: (
            x['match_type'] == 'hybrid',
            x['match_type'] == 'content',
            x['salary_match'],
            x['title_match'],
            x['match_count']
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

        # Generate recommendations
        recommendations = recommend_jobs(job_data, skills, jobseeker_industry, job_titles, jobseeker_salary=jobseeker_salary)

        print(json.dumps(recommendations))

    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
