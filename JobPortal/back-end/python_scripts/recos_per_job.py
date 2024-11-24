import sys
import json

def check_salary_match(job_salary_range, jobseeker_salary):
    """
    Stage 3: Check if jobseeker's salary expectation matches the job's salary range.

    The function returns True if any salary in the jobseeker's list falls within
    the job's salary range (inclusive).
    """
    if not jobseeker_salary or len(job_salary_range) != 2:
        return False  # Return False if inputs are invalid
    
    min_salary, max_salary = job_salary_range  # Unpack the salary range
    return any(
        min_salary <= user_salary <= max_salary  # Check if salary falls within the range
        for user_salary in jobseeker_salary
    )

def calculate_score(criteria):
    """
    Calculate a weighted score for a job seeker based on fulfilled criteria.
    Higher weight indicates higher priority.
    """
    score = 0
    if criteria['salary_match']:
        score += 3  # Highest priority
    if criteria['title_match']:
        score += 2  # High priority
    score += criteria['skill_match_count']  # Add skill match count as-is (higher count means higher score)
    return score

def recommend_candidates(job_postings, applicants):
    recommendations = {}

    for job in job_postings:
        job_skills = set(job.get('required_skills', []))
        job_title = job.get('job_title', 'No Job Title Provided')
        job_salary_range = job.get('salaryrange', [])

        for applicant in applicants:
            user_id = applicant.get('user_id')
            applicant_titles = applicant.get('job_titles', [])
            applicant_skills = set(applicant.get('skills', []))
            applicant_salary = applicant.get('salary', [])

            print(f"Debug: Job Salary Range: {job_salary_range}, Applicant Salary: {applicant_salary}", file=sys.stderr)

            has_title_match = job_title in applicant_titles
            matched_skills = job_skills.intersection(applicant_skills)
            skill_match_count = len(matched_skills)
            salary_match = check_salary_match(job_salary_range, applicant_salary)

            # Skip applicants with no matches in any criteria
            if not (has_title_match or skill_match_count > 0 or salary_match):
                continue

            # Calculate weighted score for this job
            criteria = {
                'title_match': has_title_match,
                'skill_match_count': skill_match_count,
                'salary_match': salary_match
            }
            overall_score = calculate_score(criteria)

            # If this applicant already exists, keep the best match
            if user_id in recommendations:
                existing_score = recommendations[user_id]['overall_score']
                if overall_score > existing_score:
                    recommendations[user_id] = {
                        'user_id': user_id,
                        'full_name': applicant.get('full_name', 'No Name Provided'),
                        'job_titles': applicant_titles,
                        'matched_skills': list(matched_skills),
                        'profile_picture_url': applicant.get('profile_picture_url', ''),
                        'email': applicant.get('email', ''),
                        'phone_number': applicant.get('phone_number', ''),
                        'additional_info': applicant.get('additional_info', ''),
                        'status': applicant.get('status', ''),
                        'date_applied': applicant.get('date_applied', ''),
                        'application_id': applicant.get('application_id', ''),
                        'recommended_job_title': job_title,
                        'title_match': has_title_match,
                        'skill_match_count': skill_match_count,
                        'salary_match': salary_match,
                        'overall_score': overall_score
                    }
            else:
                # Add a new recommendation for this applicant
                recommendations[user_id] = {
                    'user_id': user_id,
                    'full_name': applicant.get('full_name', 'No Name Provided'),
                    'job_titles': applicant_titles,
                    'matched_skills': list(matched_skills),
                    'profile_picture_url': applicant.get('profile_picture_url', ''),
                    'email': applicant.get('email', ''),
                    'phone_number': applicant.get('phone_number', ''),
                    'additional_info': applicant.get('additional_info', ''),
                    'status': applicant.get('status', ''),
                    'date_applied': applicant.get('date_applied', ''),
                    'application_id': applicant.get('application_id', ''),
                    'recommended_job_title': job_title,
                    'title_match': has_title_match,
                    'skill_match_count': skill_match_count,
                    'salary_match': salary_match,
                    'overall_score': overall_score
                }

    # Convert recommendations to a sorted list based on the overall score
    sorted_recommendations = sorted(
        recommendations.values(),
        key=lambda x: x['overall_score'],
        reverse=True
    )

    return sorted_recommendations


if __name__ == '__main__':
    try:
        input_data = sys.stdin.read()
        print(f'Received input data: {input_data}', file=sys.stderr)  # Debugging output to stderr

        input_json = json.loads(input_data)
        job_postings = input_json.get('job_postings', [])
        applicants = input_json.get('applicants', [])

        recommended_candidates = recommend_candidates(job_postings, applicants)

        output_data = json.dumps({'recommendations': recommended_candidates})
        print(f'Output data: {output_data}', file=sys.stderr)  # Debugging output to stderr

        # Only JSON output to stdout
        print(output_data)
        sys.exit(0)

    except Exception as e:
        print(f'Unexpected error occurred: {str(e)}', file=sys.stderr)
        sys.exit(1) 
