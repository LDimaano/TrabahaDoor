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

    for job in job_data:
        job_skills = set(job.get('required_skills', []))
        job_industry = job.get('industry_name', 'Unknown Industry')
        job_title = job.get('job_title', 'Unknown Title')
        job_salary_range = job.get('salaryrange', 'unknown salary')

        # Check job salary range compatibility
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

        content_match = title_match or match_count > 0 or industry_match
        if content_match and collaborative_match:
            match_type = 'hybrid'
        elif content_match:
            match_type = 'content'
        elif collaborative_match:
            match_type = 'collaborative'
        else:
            continue

        # Log and append job if matches criteria
        print(f"Job: {job_title}, Salary Match: {salary_match}", file=sys.stderr)
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
            'match_type': match_type
        })

    # Sort recommendations by match type, prioritizing salary match
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
