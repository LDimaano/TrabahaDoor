import sys
import json

def recommend_candidates(job_postings, applicants, contact_history):
    """Generate a list of recommended candidates based on job postings and collaborative filtering by contact history."""
    title_matches = []
    skill_matches = []
    contact_matches = []
    seen_user_ids = set()

    # First, recommend candidates based on job title matches
    for job in job_postings:
        job_skills = set(job.get('required_skills', []))
        job_industry = job.get('industry', '')
        job_title = job.get('job_title', '')  # Keep the job title as is

        for applicant in applicants:
            applicant_titles = applicant.get('job_titles', [])  # Keep applicant titles as is
            applicant_skills = set(applicant.get('skills', []))
            applicant_full_name = applicant.get('full_name', 'No Name Provided')
            user_id = applicant.get('user_id')
            applicant_industry = applicant.get('industry', '')

            # Check if any applicant job title matches the job posting title
            job_title_match = job_title in applicant_titles

            # If a job title match is found, prioritize this applicant
            if job_title_match and user_id not in seen_user_ids:
                recommended_job_title = applicant_titles[0] if applicant_titles else "No Job Title"
                title_matches.append({
                    'user_id': user_id,
                    'full_name': applicant_full_name,
                    'job_title': recommended_job_title,
                    'matched_skills': list(job_skills.intersection(applicant_skills)),
                    'industry_match': job_industry == applicant_industry,
                    'profile_picture_url': applicant.get('profile_picture_url', ''),
                    'from_collaborative_filtering': False,
                    'match_type': 'title'
                })
                seen_user_ids.add(user_id)
                continue

            # If no title match, recommend based on skill and industry matches
            matched_skills = job_skills.intersection(applicant_skills)
            industry_match = job_industry == applicant_industry

            if (matched_skills or industry_match) and user_id not in seen_user_ids:
                recommended_job_title = applicant_titles[0] if applicant_titles else "No Job Title"
                skill_matches.append({
                    'user_id': user_id,
                    'full_name': applicant_full_name,
                    'job_title': recommended_job_title,
                    'matched_skills': list(matched_skills) if matched_skills else [],
                    'industry_match': industry_match,
                    'profile_picture_url': applicant.get('profile_picture_url', ''),
                    'from_collaborative_filtering': False,
                    'match_type': 'both' if matched_skills and industry_match else 'skills' if matched_skills else 'industry'
                })
                seen_user_ids.add(user_id)

    # Now, incorporate collaborative filtering by recommending applicants contacted by similar employers
    for contact in contact_history:
        js_user_id = contact.get('js_user_id')
        full_name = contact.get('full_name')
        job_title = contact.get('job_title', "No Job Title")
        profile_picture_url = contact.get('profile_picture_url', '')
        skills = contact.get('skills', [])

        # Ensure jobseeker only appears once based on user_id
        if js_user_id not in seen_user_ids:
            contact_matches.append({
                'user_id': js_user_id,
                'full_name': full_name,
                'job_title': job_title,
                'matched_skills': skills,
                'profile_picture_url': profile_picture_url,
                'from_collaborative_filtering': True,
                'match_type': 'collaborative'
            })
            seen_user_ids.add(js_user_id)

    # Prioritize candidates: first title matches, then skill matches, then collaborative filtering matches
    recommendations = title_matches + skill_matches + contact_matches

    return recommendations

if __name__ == '__main__':
    try:
        # Load job postings, applicants, and contact history from input
        input_data = sys.stdin.read()
        input_json = json.loads(input_data)
        job_postings = input_json.get('job_postings', [])
        applicants = input_json.get('applicants', [])
        contact_history = input_json.get('contact_history', [])

        # Generate recommendations
        recommended_candidates = recommend_candidates(job_postings, applicants, contact_history)

        # Print only valid JSON output
        print(json.dumps(recommended_candidates))
        sys.exit(0)

    except Exception as e:
        print(f'Unexpected error occurred: {str(e)}', file=sys.stderr)
        sys.exit(1)
