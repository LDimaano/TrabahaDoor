import sys
import json

def recommend_jobs(job_data, skills, jobseeker_industry=None):
    recommendations = []
    skills_set = set(skills)

    # Log the skills set for debugging
    print("Skills Set:", skills_set, file=sys.stderr)
    print("Jobseeker's Industry:", jobseeker_industry, file=sys.stderr)

    for job in job_data:
        job_skills = set(job.get('required_skills', []))
        job_industry = job.get('industry_name', 'Unknown Industry')

        # Log the job being processed and its details
        print(f"Processing job: {job['job_title']} with required skills: {job_skills}, industry: {job_industry}", file=sys.stderr)

        match_count = len(skills_set.intersection(job_skills))
        industry_match = (job_industry == jobseeker_industry) if jobseeker_industry else False

        # Store match count and industry match
        recommendations.append({
            'job_title': job.get('job_title', 'Unknown Title'),
            'industry_name': job.get('industry_name', 'Unknown Industry'),
            'match_count': match_count,
            'job_id': job.get('job_id'),
            'salaryrange': job.get('salaryrange','unknown salary'),
            'jobtype': job.get('jobtype', 'Unknown Job Type'),
            'profile_picture_url': job.get('profile_picture_url', 'Unknown picture'),
            'industry_match': industry_match
        })

    # Sort by match count (skills) first and then industry match
    recommendations.sort(key=lambda x: (x['match_count'], x['industry_match']), reverse=True)

    # Return the top 5 recommendations
    top_n = 5
    return recommendations[:top_n]

if __name__ == '__main__':
    try:
        job_data = json.loads(sys.argv[1])
        skills = json.loads(sys.argv[2])
        jobseeker_industry = sys.argv[3] if len(sys.argv) > 3 else None  # Jobseeker's industry

        # Only output the recommendations as JSON
        recommended_jobs = recommend_jobs(job_data, skills, jobseeker_industry)
        print(json.dumps(recommended_jobs))  # Ensure this is the only output
        sys.exit(0)

    except json.JSONDecodeError as e:
        print(f'JSON decoding error: {str(e)}', file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f'Unexpected error occurred: {str(e)}', file=sys.stderr)
        sys.exit(1)
