import sys
import json

def check_salary_match(job_salary_range, jobseeker_salary):
    """Check if any salary from the applicant matches the salary range of the job."""
    return any(user_salary == job_salary_range for user_salary in jobseeker_salary) if jobseeker_salary else False

def calculate_score(criteria):
    """Calculate the score for a job seeker based on fulfilled criteria."""
    return sum(1 for value in criteria.values() if value)

def recommend_candidates(job_postings, applicants):
    recommendations = []

    for job in job_postings:
        job_skills = set(job.get('required_skills', []))
        job_title = job.get('job_title', 'No Job Title Provided')
        job_salary_range = job.get('salaryrange', [])  # Correct usage of job salary range

        for applicant in applicants:
            user_id = applicant.get('user_id')
            applicant_titles = applicant.get('job_titles', [])
            applicant_skills = set(applicant.get('skills', []))
            applicant_salary = applicant.get('salary', [])  # Applicant salary array

            has_title_match = job_title in applicant_titles
            matched_skills = job_skills.intersection(applicant_skills)
            salary_match = check_salary_match(job_salary_range, applicant_salary)

            # Exclude candidates with no matching criteria
            if not (has_title_match or matched_skills or salary_match):
                continue

            # Calculate score based on matching criteria
            criteria = {
                'title_match': has_title_match,
                'skill_match_count': len(matched_skills) > 0,
                'salary_match': salary_match
            }
            overall_score = calculate_score(criteria)

            recommendation_data = {
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
                'title_match': has_title_match,
                'skill_match_count': len(matched_skills),
                'salary_match': salary_match,
                'overall_score': overall_score
            }

            recommendations.append(recommendation_data)

    # Sort recommendations based on overall score
    recommendations.sort(
        key=lambda x: x['overall_score'],
        reverse=True
    )

    return recommendations

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
