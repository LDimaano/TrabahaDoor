import sys
import json

def recommend_candidates(job_postings, applicants):
    """Generate a list of recommended candidates based on job postings, ensuring no duplicate job seekers."""
    recommendations = {}

    for job in job_postings:
        job_skills = set(job.get('required_skills', []))

        for applicant in applicants:
            applicant_titles = applicant.get('job_titles', [])
            applicant_skills = set(applicant.get('skills', []))
            applicant_full_name = applicant.get('full_name', 'No Name Provided')
            user_id = applicant.get('user_id')

            # Check for skill matches
            matched_skills = job_skills.intersection(applicant_skills)

            if matched_skills:  # At least one skill matches
                recommended_job_title = applicant_titles[0] if applicant_titles else "No Job Title"

                # Ensure jobseeker only appears once based on user_id
                if user_id not in recommendations:
                    recommendations[user_id] = {
                        'user_id': user_id,
                        'full_name': applicant_full_name,
                        'job_title': recommended_job_title,
                        'matched_skills': list(matched_skills),
                        'profile_picture_url': applicant.get('profile_picture_url', ''),
                    }

    # Convert dictionary back to a list
    return list(recommendations.values())

if __name__ == '__main__':
    try:
        # Load job postings and applicants from input
        input_data = sys.stdin.read()
        input_json = json.loads(input_data)
        job_postings = input_json.get('job_postings', [])
        applicants = input_json.get('applicants', [])

        # Generate recommendations
        recommended_candidates = recommend_candidates(job_postings, applicants)

        # Print only valid JSON output
        print(json.dumps(recommended_candidates))
        sys.exit(0)

    except Exception as e:
        print(f'Unexpected error occurred: {str(e)}', file=sys.stderr)
        sys.exit(1)
