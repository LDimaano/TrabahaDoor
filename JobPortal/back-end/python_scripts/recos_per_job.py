import sys
import json

def recommend_candidates(job_postings, applicants):
    recommendations = []

    for job in job_postings:
        job_skills = set(job.get('required_skills', []))
        job_title = job.get('job_title', 'No Job Title Provided')
        job_salary = job.get('salary', 0)

        for applicant in applicants:
            user_id = applicant.get('user_id')
            applicant_titles = applicant.get('job_titles', [])
            applicant_skills = set(applicant.get('skills', []))
            applicant_salary = applicant.get('desired_salary', 0)
            applicant_full_name = applicant.get('full_name', 'No Name Provided')

            has_title_match = job_title in applicant_titles
            matched_skills = job_skills.intersection(applicant_skills)
            has_skill_match = bool(matched_skills)
            salary_alignment = abs(job_salary - applicant_salary) if job_salary and applicant_salary else float('inf')

            recommendation_data = {
                'user_id': user_id,
                'full_name': applicant_full_name,
                'job_title': job_title,
                'recommended_job_title': applicant_titles[0] if applicant_titles else "No Job Title",
                'matched_skills': list(matched_skills),
                'profile_picture_url': applicant.get('profile_picture_url', ''),
                'email': applicant.get('email', ''),
                'phone_number': applicant.get('phone_number', ''),
                'additional_info': applicant.get('additional_info', ''),
                'status': applicant.get('status', ''),
                'date_applied': applicant.get('date_applied', ''),
                'application_id': applicant.get('application_id', ''),
                'title_match': has_title_match,
                'skill_match': has_skill_match,
                'skill_match_count': len(matched_skills),
                'salary_alignment': salary_alignment,
            }

            print(f'Adding recommendation: {recommendation_data}')  # Debugging output

            recommendations.append(recommendation_data)

    # Sorting the recommendations based on the criteria
    recommendations.sort(
        key=lambda x: (
            x['title_match'],
            x['skill_match'],
            x['skill_match_count'],
            -x['salary_alignment']
        ),
        reverse=True
    )

    return recommendations

if __name__ == '__main__':
    try:
        input_data = sys.stdin.read()
        print(f'Received input data: {input_data}')  # Debugging output

        input_json = json.loads(input_data)
        job_postings = input_json.get('job_postings', [])
        applicants = input_json.get('applicants', [])

        recommended_candidates = recommend_candidates(job_postings, applicants)

        output_data = json.dumps({'recommendations': recommended_candidates})
        print(f'Output data: {output_data}')  # Debugging output

        print(output_data)
        sys.exit(0)

    except Exception as e:
        print(f'Unexpected error occurred: {str(e)}', file=sys.stderr)
        sys.exit(1)
