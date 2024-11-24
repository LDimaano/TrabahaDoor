import sys
import json

def check_salary_match(job_salary, jobseeker_salary):
    """Check if the job salary matches any salary in the jobseeker's salary list."""
    if not jobseeker_salary:
        return False  # Return False if no jobseeker salary is provided
    
    # Ensure job salary is treated as a string for comparison
    job_salary = str(job_salary)
    
    # Convert all jobseeker salaries to strings for comparison
    jobseeker_salary = [str(salary) for salary in jobseeker_salary]
    
    # Check if job salary matches any salary in jobseeker's salary list
    return job_salary in jobseeker_salary



def calculate_score(criteria):
    """
    Calculate the score for a job seeker based on fulfilled criteria.
    """
    return sum(1 for value in criteria.values() if value)


def recommend_candidates(job_postings, applicants):
    recommendations = {}

    for job in job_postings:
        job_skills = set(job.get('required_skills', []))
        job_title = job.get('job_title', 'No Job Title Provided')
        job_salary = job.get('salaryrange', 'Unknown Salary')  # Job salary as a single value

        for applicant in applicants:
            user_id = applicant.get('user_id')
            applicant_titles = applicant.get('job_titles', [])
            applicant_skills = set(applicant.get('skills', []))
            applicant_salary = applicant.get('salary', [])

            # Debug: Print the salary information
            print(f"Debug: Job Salary: {job_salary}, Applicant Salary: {applicant_salary}", file=sys.stderr)

            has_title_match = job_title in applicant_titles
            matched_skills = job_skills.intersection(applicant_skills)
            skill_match_count = len(matched_skills)
            salary_match = check_salary_match(job_salary, applicant_salary)

            # Skip applicants with no matches in any criteria
            if not (has_title_match or matched_skills or salary_match):
                continue

            # Calculate score for this job
            criteria = {
                'title_match': has_title_match,
                'skill_match_count': skill_match_count > 0,
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
        key=lambda x: (x['overall_score'], x['skill_match_count'], x['salary_match']),
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
