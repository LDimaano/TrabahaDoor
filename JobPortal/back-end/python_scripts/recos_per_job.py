import sys
import json


def check_salary_match(job_salary, jobseeker_salary):
    """Check if the job salary matches any salary in the jobseeker's salary list."""
    if not jobseeker_salary:
        return False  # No jobseeker salary provided

    # Ensure job salary is treated as a string for comparison
    job_salary = str(job_salary)

    # Convert all jobseeker salaries to strings for comparison
    jobseeker_salary = [str(salary) for salary in jobseeker_salary]

    return job_salary in jobseeker_salary


def count_education_matches(job_education, applicant_education):
    """Count the number of matching education levels between job and applicant."""
    if not job_education or not applicant_education:
        return 0
    return sum(edu in applicant_education for edu in job_education)


def calculate_score(criteria):
    """Calculate the score for a job seeker based on fulfilled criteria."""
    return sum(1 for value in criteria.values() if value)


def recommend_candidates(job_postings, applicants):
    recommendations = {}

    for job in job_postings:
        job_skills = set(job.get('required_skills', []))
        job_title = job.get('job_title', 'No Job Title Provided')
        job_salary = job.get('salaryrange', 'Unknown Salary')
        job_education = job.get('education', [])

        for applicant in applicants:
            user_id = applicant.get('user_id')
            applicant_titles = applicant.get('job_titles', [])
            applicant_skills = set(applicant.get('skills', []))
            applicant_salary = applicant.get('salary', [])
            applicant_education = applicant.get('js_education', [])

            has_title_match = job_title in applicant_titles
            matched_skills = job_skills.intersection(applicant_skills)
            skill_match_count = len(matched_skills)
            salary_match = check_salary_match(job_salary, applicant_salary)
            education_match_count = count_education_matches(job_education, applicant_education)

            # Skip if no significant match is found
            if not (has_title_match or skill_match_count or education_match_count):
                continue

            # Define criteria for scoring
            criteria = {
                'title_match': has_title_match,
                'skill_match_count': skill_match_count > 0,
                'salary_match': salary_match,
                'education_match': education_match_count > 0
            }
            overall_score = calculate_score(criteria)

            # Update or add recommendation
            if user_id in recommendations:
                existing_score = recommendations[user_id]['overall_score']
                if overall_score > existing_score:
                    recommendations[user_id].update({
                        'education_match_count': education_match_count,
                        'overall_score': overall_score
                    })
            else:
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
                    'education_match_count': education_match_count,
                    'overall_score': overall_score
                }

    # Convert recommendations to a sorted list based on the overall score
    sorted_recommendations = sorted(
        recommendations.values(),
        key=lambda x: (
            x['overall_score'],           # Primary: Higher overall score
            x['education_match_count'],   # Secondary: More education matches
            x['skill_match_count'],       # Tertiary: More skills matched
            x['salary_match']             # Quaternary: Salary match (True > False)
        ),
        reverse=True  # Ensure descending order
    )

    return sorted_recommendations


if __name__ == '__main__':
    try:
        # Read input JSON from stdin
        input_data = sys.stdin.read()
        print(f'Received input data: {input_data}', file=sys.stderr)  # Debugging output to stderr

        input_json = json.loads(input_data)
        job_postings = input_json.get('job_postings', [])
        applicants = input_json.get('applicants', [])

        # Generate recommendations
        recommended_candidates = recommend_candidates(job_postings, applicants)

        # Output recommendations as JSON
        output_data = json.dumps({'recommendations': recommended_candidates})
        print(f'Output data: {output_data}', file=sys.stderr)  # Debugging output to stderr

        print(output_data)  # JSON output to stdout
        sys.exit(0)

    except Exception as e:
        print(f'Unexpected error occurred: {str(e)}', file=sys.stderr)
        sys.exit(1)
