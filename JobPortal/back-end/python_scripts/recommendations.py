import sys
import json

def recommend_jobs(job_data, skills, jobseeker_industry=None, past_applications=None, similar_jobseekers=None):
    recommendations = []
    skills_set = set(skills)

    # Log the skills set for debugging
    print("Skills Set:", skills_set, file=sys.stderr)
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

    # Use a set to track all recommended job IDs
    recommended_job_ids = set()

    # Iterate through job data to find matches
    for job in job_data:
        job_skills = set(job.get('required_skills', []))
        job_industry = job.get('industry_name', 'Unknown Industry')

        # Log the job being processed and its details
        print(f"Processing job: {job['job_title']} with required skills: {job_skills}, industry: {job_industry}", file=sys.stderr)

        # Count skill matches
        match_count = len(skills_set.intersection(job_skills))
        industry_match = (job_industry == jobseeker_industry) if jobseeker_industry else False
        collaborative_match = job.get('job_id') in collaborative_filtering_jobs

        # Log match counts and filters
        print(f"Match Count: {match_count}, Industry Match: {industry_match}, Collaborative Match: {collaborative_match}", file=sys.stderr)

        # Always add jobs with collaborative matches or skills
        recommendations.append({
            'job_title': job.get('job_title', 'Unknown Title'),
            'industry_name': job.get('industry_name', 'Unknown Industry'),
            'match_count': match_count,
            'job_id': job.get('job_id'),
            'salaryrange': job.get('salaryrange', 'unknown salary'),
            'jobtype': job.get('jobtype', 'Unknown Job Type'),
            'profile_picture_url': job.get('profile_picture_url', 'Unknown picture'),
            'industry_match': industry_match,
            'collaborative_match': collaborative_match,
            'similar_seekers': collaborative_filtering_jobs.get(job.get('job_id'), []), 
        })
        recommended_job_ids.add(job.get('job_id'))

    # Check total recommendations before sorting
    print(f"Total Recommendations Before Sorting: {len(recommendations)}", file=sys.stderr)

    # Sort by match count (skills), industry match, and collaborative filtering match
    recommendations.sort(key=lambda x: (x['match_count'], x['industry_match'], x['collaborative_match']), reverse=True)

    # Log total recommendations after sorting
    print(f"Total Recommendations After Sorting: {len(recommendations)}", file=sys.stderr)

    return recommendations  # Return the recommendations

if __name__ == '__main__':
    try:
        job_data = json.loads(sys.argv[1])
        skills = json.loads(sys.argv[2])
        jobseeker_industry = sys.argv[3] if len(sys.argv) > 3 else None
        past_applications = json.loads(sys.argv[4]) if len(sys.argv) > 4 else None
        similar_jobseekers = json.loads(sys.argv[5]) if len(sys.argv) > 5 else None

        # Only output the recommendations as JSON
        recommended_jobs = recommend_jobs(job_data, skills, jobseeker_industry, past_applications, similar_jobseekers)
        print(json.dumps(recommended_jobs))

    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
