import sys
import json

def recommend_jobs(job_data, skills, jobseeker_industry=None, job_titles=None, past_applications=None, similar_jobseekers=None):
    recommendations = []
    skills_set = set(skills)
    job_titles_set = set(job_titles)

    # Log the skills set and job titles set for debugging
    print("Skills Set:", skills_set, file=sys.stderr)
    print("Job Titles Set:", job_titles_set, file=sys.stderr)
    print("Jobseeker's Industry:", jobseeker_industry, file=sys.stderr)

    # Collaborative filtering: Jobseeker's past application data and similar jobseekers' data
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

        # Count skill matches
        match_count = len(skills_set.intersection(job_skills))
        industry_match = (job_industry == jobseeker_industry) if jobseeker_industry else False
        collaborative_match = job.get('job_id') in collaborative_filtering_jobs
        title_match = job_title in job_titles_set

        # Calculate similarity score
        similarity_score = match_count  # Base score from skills
        influence_tag = 'content'  # Default influence

        # Increase score for industry match
        if industry_match:
            similarity_score += 2  # You can adjust this weight as needed
            influence_tag = 'content' if influence_tag == 'content' else 'hybrid'

        # Increase score for collaborative match
        if collaborative_match:
            similarity_score += 3  # You can adjust this weight as needed
            influence_tag = 'collaborative' if influence_tag == 'collaborative' else 'hybrid'

        # Log match counts and filters
        print(f"Job: {job_title}, Match Count: {match_count}, Industry Match: {industry_match}, Collaborative Match: {collaborative_match}, Title Match: {title_match}, Similarity Score: {similarity_score}", file=sys.stderr)

        # Only add recommendation if there is a match
        if match_count > 0 or industry_match or collaborative_match:
            recommendations.append({
                'job_title': job_title,
                'industry_name': job.get('industry_name', 'Unknown Industry'),
                'match_count': match_count,
                'job_id': job.get('job_id'),
                'salaryrange': job.get('salaryrange', 'unknown salary'),
                'jobtype': job.get('jobtype', 'Unknown Job Type'),
                'profile_picture_url': job.get('profile_picture_url', 'Unknown picture'),
                'industry_match': industry_match,
                'collaborative_match': collaborative_match,
                'title_match': title_match,
                'similar_seekers': collaborative_filtering_jobs.get(job.get('job_id'), []),
                'similarity_score': similarity_score,
                'influence_tag': influence_tag  # Add influence tag
            })

    # Sort recommendations by similarity score (highest first)
    recommendations.sort(key=lambda x: x['similarity_score'], reverse=True)

    # Return the recommendations
    return recommendations

if __name__ == '__main__':
    try:
        job_data = json.loads(sys.argv[1])
        skills = json.loads(sys.argv[2])
        jobseeker_industry = sys.argv[3] if len(sys.argv) > 3 else None
        job_titles = json.loads(sys.argv[4]) if len(sys.argv) > 4 else []  
        past_applications = json.loads(sys.argv[5]) if len(sys.argv) > 5 else None
        similar_jobseekers = json.loads(sys.argv[6]) if len(sys.argv) > 6 else None

        # Only output the recommendations as JSON
        recommended_jobs = recommend_jobs(job_data, skills, jobseeker_industry, job_titles, past_applications, similar_jobseekers)
        print(json.dumps(recommended_jobs))

    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
