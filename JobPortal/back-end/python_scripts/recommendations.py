def recommend_jobs(job_data, skills, jobseeker_industry=None, job_titles=None, similar_jobseekers=None, jobseeker_salary=None):
    recommendations = []
    skills_set = set(skills)
    job_titles_set = set(job_titles)

    # Log the skills set and job titles set for debugging
    print("Skills Set:", skills_set, file=sys.stderr)
    print("Job Titles Set:", job_titles_set, file=sys.stderr)
    print("Jobseeker's Industry:", jobseeker_industry, file=sys.stderr)
    print("Jobseeker's Salary Range:", jobseeker_salary, file=sys.stderr)

    # Collaborative filtering: Jobseeker's similar jobseekers' data
    collaborative_filtering_jobs = {}

    if similar_jobseekers:
        for jobseeker in similar_jobseekers:
            for job in jobseeker.get('applied_jobs', []):
                job_id = job['job_id']
                if job_id not in collaborative_filtering_jobs:
                    collaborative_filtering_jobs[job_id] = []
                collaborative_filtering_jobs[job_id].append(jobseeker['user_id'])

        # Log collaborative filtering jobs
        print(f"Collaborative filtering jobs: {collaborative_filtering_jobs}", file=sys.stderr)

    # Iterate through job data to find matches
    for job in job_data:
        job_skills = set(job.get('required_skills', []))
        job_industry = job.get('industry_name', 'Unknown Industry')
        job_title = job.get('job_title', 'Unknown Title')
        job_salary = job.get('salaryrange', 'unknown salary')

        # Count skill matches
        match_count = len(skills_set.intersection(job_skills))
        industry_match = (job_industry == jobseeker_industry) if jobseeker_industry else False
        title_match = job_title in job_titles_set
        collaborative_match = job.get('job_id') in collaborative_filtering_jobs

        # Salary match logic
        salary_match = job_salary == jobseeker_salary if jobseeker_salary else False

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

        # Log match counts and filters
        print(f"Job: {job_title}, Match Count: {match_count}, Industry Match: {industry_match}, "
              f"Collaborative Match: {collaborative_match}, Title Match: {title_match}, "
              f"Salary Match: {salary_match}, Match Type: {match_type}", file=sys.stderr)

        # Add recommendation with match type
        recommendations.append({
            'job_title': job_title,
            'industry_name': job_industry,
            'match_count': match_count,
            'job_id': job.get('job_id'),
            'salaryrange': job_salary,
            'jobtype': job.get('jobtype', 'Unknown Job Type'),
            'profile_picture_url': job.get('profile_picture_url', 'Unknown picture'),
            'industry_match': industry_match,
            'collaborative_match': collaborative_match,
            'title_match': title_match,
            'salary_match': salary_match,
            'similar_seekers': collaborative_filtering_jobs.get(job.get('job_id'), []),
            'match_type': match_type  # Added match type for sorting
        })

    # Sort recommendations by match type, prioritize salary match, then title match and skill match count
    recommendations.sort(
        key=lambda x: (
            x['match_type'] == 'hybrid',
            x['match_type'] == 'content',
            x['salary_match'],  # Higher priority for jobs with matching salary
            x['title_match'],
            x['match_count']
        ),
        reverse=True
    )

    # Return the recommendations
    return recommendations
