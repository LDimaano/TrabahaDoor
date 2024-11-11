import sys
import json
import re

def recommend_jobs(job_data, skills, job_titles=None, similar_jobseekers=None, jobseeker_salary=None):
    recommendations = []
    skills_set = set(skills)
    job_titles_set = set(job_titles)

    # Log the skills set and job titles set for debugging
    print("Skills Set:", skills_set, file=sys.stderr)
    print("Job Titles Set:", job_titles_set, file=sys.stderr)
    print("Jobseeker's Salary Preference:", jobseeker_salary, file=sys.stderr)

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

    # Function to extract and normalize salary range
    def get_salary_value(salary_range):
        if isinstance(salary_range, list):
            # If salary_range is an array, take the highest value
            return max([get_salary_value(s) for s in salary_range], default=0)
        
        # If salary_range is a string, check if it contains "Above" or "Below"
        salary_range = str(salary_range).strip()
        
        if 'Above' in salary_range:
            # Extract number after 'Above' (e.g., "Above 50000")
            match = re.search(r'Above\s*(\d+)', salary_range)
            return float(match.group(1)) if match else 0
        elif 'Below' in salary_range:
            # Extract number after 'Below' (e.g., "Below 20000")
            match = re.search(r'Below\s*(\d+)', salary_range)
            return float(match.group(1)) if match else 0
        else:
            try:
                # If salary is a plain number
                return float(salary_range)
            except ValueError:
                return 0

    # Function to check if salary matches the jobseeker's preference
    def salary_matches(job_salary, jobseeker_salary):
        if jobseeker_salary is None:
            return True  # If no preference, any salary is a match
        
        # If the jobseeker salary is a specific range, we should check if the job fits within that range
        if isinstance(jobseeker_salary, dict) and 'min' in jobseeker_salary and 'max' in jobseeker_salary:
            # Check if job salary is within the preferred range
            return jobseeker_salary['min'] <= job_salary <= jobseeker_salary['max']
        return job_salary == jobseeker_salary  # Otherwise, just check for an exact match

    # Iterate through job data to find matches
    for job in job_data:
        job_skills = set(job.get('required_skills', []))
        job_title = job.get('job_title', 'Unknown Title')
        salary_range = job.get('salaryrange', [])
        
        # Normalize salary range
        salary_value = get_salary_value(salary_range)

        # Count skill matches
        match_count = len(skills_set.intersection(job_skills))
        title_match = job_title in job_titles_set
        collaborative_match = job.get('job_id') in collaborative_filtering_jobs

        # Determine if both job title and skills match
        content_match = title_match or match_count > 0

        # Only consider salary match if job title and skills match
        salary_match = False
        if content_match:
            salary_match = salary_matches(salary_value, jobseeker_salary)

        # Determine match type
        if content_match and salary_match and collaborative_match:
            match_type = 'hybrid'  # Hybrid match
        elif content_match and salary_match:
            match_type = 'content'  # Content-based match
        elif collaborative_match:
            match_type = 'collaborative'  # Collaborative match
        else:
            continue  # Skip jobs with no match

        # Log match counts and filters
        print(f"Job: {job_title}, Match Count: {match_count}, Collaborative Match: {collaborative_match}, Title Match: {title_match}, Salary Match: {salary_match}, Match Type: {match_type}, Salary Range: {salary_value}", file=sys.stderr)

        # Add recommendation with match type and actual salary string
        recommendations.append({
            'job_title': job_title,
            'match_count': match_count,
            'job_id': job.get('job_id'),
            'salaryrange': salary_range,  # Keep the original salary range
            'jobtype': job.get('jobtype', 'Unknown Job Type'),
            'industry_match': False,  # Industry match removed
            'collaborative_match': collaborative_match,
            'title_match': title_match,
            'similar_seekers': collaborative_filtering_jobs.get(job.get('job_id'), []),
            'match_type': match_type  # Added match type for sorting
        })

    # Sort recommendations:
    # 1. Prioritize by match type (hybrid > content > collaborative)
    # 2. Within each match type, prioritize by salary match (relevant salaries first)
    # 3. Then by title match and match count
    recommendations.sort(
        key=lambda x: (
            x['match_type'] == 'hybrid', 
            x['match_type'] == 'content', 
            x['salaryrange'],  # Keep original salary range for sorting
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
        job_titles = json.loads(sys.argv[3]) if len(sys.argv) > 3 else []
        similar_jobseekers = json.loads(sys.argv[4]) if len(sys.argv) > 4 else None
        jobseeker_salary = json.loads(sys.argv[5]) if len(sys.argv) > 5 else None  # Expected salary range or exact salary

        # Only output the recommendations as JSON
        recommended_jobs = recommend_jobs(job_data, skills, job_titles, similar_jobseekers, jobseeker_salary)
        print(json.dumps(recommended_jobs))

    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
