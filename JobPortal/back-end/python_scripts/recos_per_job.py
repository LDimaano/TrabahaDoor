import sys
import json

def recommend_candidates(job_postings, applicants):
    recommendations = {}

    for job in job_postings:
        job_skills = set(job.get('required_skills', []))
        job_title = job.get('job_title', 'No Job Title Provided')

        for applicant in applicants:
            applicant_titles = applicant.get('job_titles', [])
            applicant_skills = set(applicant.get('skills', []))
            applicant_full_name = applicant.get('full_name', 'No Name Provided')
            user_id = applicant.get('user_id')

            matched_skills = job_skills.intersection(applicant_skills)

            if matched_skills:
                recommended_job_title = applicant_titles[0] if applicant_titles else "No Job Title"

                if user_id not in recommendations:
                    recommendations[user_id] = {
                        'user_id': user_id,
                        'full_name': applicant_full_name,
                        'job_title': job_title,
                        'recommended_job_title': recommended_job_title,
                        'matched_skills': list(matched_skills),
                        'profile_picture_url': applicant.get('profile_picture_url', ''),
                        'email': applicant.get('email', ''),
                        'phone_number': applicant.get('phone_number', ''),
                        'additional_info': applicant.get('additional_info', ''),
                        'status': applicant.get('status', ''),
                        'date_applied': applicant.get('date_applied', ''),
                        'application_id': applicant.get('application_id', ''),
                    }

    return list(recommendations.values())

if __name__ == '__main__':
    try:
        input_data = sys.stdin.read()
        input_json = json.loads(input_data)
        job_postings = input_json.get('job_postings', [])
        applicants = input_json.get('applicants', [])

        recommended_candidates = recommend_candidates(job_postings, applicants)

        print(json.dumps({'recommendations': recommended_candidates}))
        sys.exit(0)

    except Exception as e:
        print(f'Unexpected error occurred: {str(e)}', file=sys.stderr)
        sys.exit(1)
