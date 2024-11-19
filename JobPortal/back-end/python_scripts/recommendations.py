import json
import sys

def recommend_jobs(job_data, skills, jobseeker_industry=None, job_titles=None, similar_jobseekers=None, jobseeker_salary=None):
    recommendations = []
    skills_set = set(skills)
    job_titles_set = set(job_titles)

    collaborative_filtering_jobs = {}

    # Populate collaborative filtering data if available
    if similar_jobseekers:
        for jobseeker in similar_jobseekers:
            for job in jobseeker.get('applied_jobs', []):
                job_id = job['job_id']
                if job_id not in collaborative_filtering_jobs:
                    collaborative_filtering_jobs[job_id] = []
                collaborative_filtering_jobs[job_id].append(jobseeker['user_id'])

    # Iterate through job data to find matches
    for job in job_data:
        job_skills = set(job.get('required_skills', []))
        job_industry = job.get('industry_name', 'Unknown Industry')
        job_title = job.get('job_title', 'Unknown Title')
        job_salary_range = job.get('salaryrange', 'unknown salary')

        # Match evaluation: check if job matches on title or skills
        title_match = job_title in job_titles_set
        skill_match_count = len(skills_set.intersection(job_skills))
        
        # Only proceed to evaluate salary if there's a match on title or skills
        salary_match = False
        if title_match or skill_match_count > 0:
            if jobseeker_salary:
                salary_match = any(
                    user_salary == job_salary_range
                    for user_salary in jobseeker_salary
                )

        # If there's no match on title or skills, skip this job
        if not (title_match or skill_match_count > 0):
            continue

        industry_match = (job_industry == jobseeker_industry) if jobseeker_industry else False
        collaborative_match = job.get('job_id') in collaborative_filtering_jobs

        # Determine match type (content-based, collaborative, or hybrid)
        if skill_match_count > 0 or collaborative_match:
            if skill_match_count > 0 and collaborative_match:
                match_type = 'hybrid'
            elif skill_match_count > 0:
                match_type = 'content'
            elif collaborative_match:
                match_type = 'collaborative'

            # Add job to recommendations if it matches on title/skills (and optionally salary)
            recommendations.append({
                'job_title': job_title,
                'industry_name': job_industry,
                'match_count': skill_match_count,
                'job_id': job.get('job_id'),
                'salaryrange': job_salary_range,
                'jobtype': job.get('jobtype', 'Unknown Job Type'),
                'industry_match': industry_match,
                'collaborative_match': collaborative_match,
                'title_match': title_match,
                'salary_match': salary_match,
                'similar_seekers': collaborative_filtering_jobs.get(job.get('job_id'), []),
                'match_type': match_type
            })

    # Sort recommendations by match type (hybrid > content > collaborative), then by salary match, title match, and match count
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

        recommendations = recommend_jobs(job_data, skills, jobseeker_industry, job_titles, jobseeker_salary=jobseeker_salary)

        print(json.dumps(recommendations))

    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
