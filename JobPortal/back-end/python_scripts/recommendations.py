import sys
import json

def recommend_jobs(job_data, skills):
    recommendations = []
    skills_set = set(skills)

    # Log the skills set for debugging
    print("Skills Set:", skills_set, file=sys.stderr)

    for job in job_data:
        job_skills = set(job.get('required_skills', []))
        # Log the job being processed and its required skills
        print(f"Processing job: {job['job_title']} with required skills: {job_skills}", file=sys.stderr)

        match_count = len(skills_set.intersection(job_skills))

        if match_count > 0:
            recommendations.append({
                'job_title': job.get('job_title', 'Unknown Title'),
                'industry_name': job.get('industry_name', 'Unknown Industry'),
                'match_count': match_count,
                'job_id': job.get('job_id'),
                'salaryrange': job.get('salaryrange', 'Unknown Salary Range'),
                'jobtype': job.get('jobtype', 'Unknown Job Type'),
                'profile_picture_url': job.get('profile_picture_url', 'Unknown picture')
            })

    recommendations.sort(key=lambda x: x['match_count'], reverse=True)
    top_n = 5
    return recommendations[:top_n]

if __name__ == '__main__':
    try:
        job_data = json.loads(sys.argv[1])
        skills = json.loads(sys.argv[2])

        # Only output the recommendations as JSON
        recommended_jobs = recommend_jobs(job_data, skills)
        print(json.dumps(recommended_jobs))  # Ensure this is the only output
        sys.exit(0)

    except json.JSONDecodeError as e:
        print(f'JSON decoding error: {str(e)}', file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f'Unexpected error occurred: {str(e)}', file=sys.stderr)
        sys.exit(1)
