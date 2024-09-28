import sys
import json

def recommend_jobs(job_data, skills):
    recommendations = []

    # Convert skills to a set for easier matching
    skills_set = set(skills)

    # Iterate through job data
    for job in job_data:
        job_skills = set(job.get('required_skills', []))  # Assume required_skills is a list in job data
        match_count = len(skills_set.intersection(job_skills))  # Count matches
        
        if match_count > 0:  # Only recommend jobs with at least one matching skill
            recommendations.append({
                'job_title': job['job_title'],
                'company': job['company'],
                'match_count': match_count,
                'job_id': job['job_id']  # Include job ID for future reference
            })

    # Sort recommendations by match count in descending order
    recommendations.sort(key=lambda x: x['match_count'], reverse=True)

    # Optional: Limit to top N recommendations
    top_n = 5  # You can change this value based on your needs
    return recommendations[:top_n]

if __name__ == '__main__':
    job_data = json.loads(sys.argv[1])  # Fetch job data from command line arguments
    skills = json.loads(sys.argv[2])     # Fetch job seeker skills from command line arguments

    recommended_jobs = recommend_jobs(job_data, skills)
    print(json.dumps(recommended_jobs))  # Output the recommendations
