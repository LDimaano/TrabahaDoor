import sys
import json

def recommend_jobs(job_data, skills):
    recommendations = []
    skills_set = set(skills)

    for job in job_data:
        job_skills = set(job.get('required_skills', []))  # Get required skills from job
        match_count = len(skills_set.intersection(job_skills))  # Count matches

        if match_count > 0:
            recommendations.append({
                'job_title': job.get('job_title', 'Unknown Title'),
                'company': job.get('company', 'Unknown Company'),  # Assuming 'company' is in job data
                'match_count': match_count,
                'job_id': job.get('job_id'),
            })

    recommendations.sort(key=lambda x: x['match_count'], reverse=True)
    top_n = 5  # Change this value based on your needs
    return recommendations[:top_n]

if __name__ == '__main__':
    try:
        job_data = json.loads(sys.argv[1])
        skills = json.loads(sys.argv[2])

        print(f'Job Data: {job_data}', file=sys.stderr)
        print(f'Skills: {skills}', file=sys.stderr)

        recommended_jobs = recommend_jobs(job_data, skills)
        print(json.dumps(recommended_jobs))
        sys.exit(0)

    except json.JSONDecodeError as e:
        print(f'JSON decoding error: {str(e)}', file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f'Error: {str(e)}', file=sys.stderr)
        sys.exit(1)
