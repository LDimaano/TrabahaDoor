import sys
import json

def parse_salary_range(salary_range):
    """Helper function to convert salary range string to a numeric tuple."""
    if salary_range == 'Below 15000':
        return (0, 15000)
    elif salary_range == 'Above 100000':
        return (100001, float('inf'))
    else:
        try:
            min_salary, max_salary = map(int, salary_range.split('-'))
            return (min_salary, max_salary)
        except ValueError:
            return (None, None)

def recommend_jobs(job_data, skills, jobseeker_industry=None, job_titles=None, similar_jobseekers=None, jobseeker_salary=None):
    recommendations = []
    skills_set = set(skills)
    job_titles_set = set(job_titles)

    # Parse user salary ranges
    user_salary_ranges = []
    if isinstance(jobseeker_salary, list):
        user_salary_ranges = [parse_salary_range(salary) for salary in jobseeker_salary]
    else:
        user_salary_ranges.append(parse_salary_range(jobseeker_salary))

    # Initialize collaborative filtering jobs dictionary
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

        # Parse job salary range
        if isinstance(job_salary_range, str):
            job_min_salary, job_max_salary = parse_salary_range(job_salary_range)
        else:
            job_min_salary = job_max_salary = None

        # Check if job salary matches any of the user's salary ranges
        salary_match = any(
            job_min_salary is not None and job_max_salary is not None and
            (user_min <= job_max_salary and user_max >= job_min_salary)
            for user_min, user_max in user_salary_ranges
        )

        # Count skill matches and determine match type
        match_count = len(skills_set.intersection(job_skills))
        industry_match = (job_industry == jobseeker_industry) if jobseeker_industry else False
        title_match = job_title in job_titles_set
        collaborative_match = job.get('job_id') in collaborative_filtering_jobs

        # Determine match type
        content_match = title_match or match_count > 0 or industry_match
        if content_match and collaborative_match:
            match_type = 'hybrid'  # Hybrid match
        elif content_match:
            match_type = 'content'  # Content-based match
        elif collaborative_match:
            match_type = 'collaborative'  # Collaborative match
        else:
            continue  # Skip jobs with no match

        # Add recommendation with match type
        recommendations.append({
            'job_title': job_title,
            'industry_name': job_industry,
            'match_count': match_count,
            'job_id': job.get('job_id'),
            'salaryrange': job_salary_range,
            'jobtype': job.get('jobtype', 'Unknown Job Type'),
            'profile_picture_url': job.get('profile_picture_url', 'Unknown picture'),
            'industry_match': industry_match,
            'collaborative_match': collaborative_match,
            'title_match': title_match,
            'salary_match': salary_match,
            'similar_seekers': collaborative_filtering_jobs.get(job.get('job_id'), []),
            'match_type': match_type  # Added match type for sorting
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

    # Return the recommendations
    return recommendations

if __name__ == '__main__':
    try:
        job_data = json.loads(sys.argv[1])
        skills = json.loads(sys.argv[2])
        jobseeker_industry = sys.argv[3] if len(sys.argv) > 3 else None
        job_titles = json.loads(sys.argv[4]) if len(sys.argv) > 4 else []
        similar_jobseekers = json.loads(sys.argv[5]) if len(sys.argv) > 5 else None
        jobseeker_salary = sys.argv[6] if len(sys.argv) > 6 else None

        recommended_jobs = recommend_jobs(
            job_data, skills, jobseeker_industry, job_titles, similar_jobseekers, jobseeker_salary
        )

        # Ensure the output is valid JSON
        if not recommended_jobs:
            print(json.dumps([]))  # Return empty array if no recommendations
        else:
            print(json.dumps(recommended_jobs))

    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        print(json.dumps({"error": str(e)}))  # Return error in JSON format
