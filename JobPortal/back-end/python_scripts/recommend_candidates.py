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
                    'match_type': 'title',
                    'influence_tag': 'content'  # Content-based filtering
                })
                seen_user_ids.add(user_id)
                continue

            # If no title match, check for skill and industry matches
            matched_skills = job_skills.intersection(applicant_skills)
            industry_match = job_industry == applicant_industry

            # Ensure at least two skill matches or one industry match
            if len(matched_skills) >= 2 or industry_match:
                if user_id not in seen_user_ids:
                    recommended_job_title = applicant_titles[0] if applicant_titles else "No Job Title"
                    skill_matches.append({
                        'user_id': user_id,
                        'full_name': applicant_full_name,
                        'job_title': recommended_job_title,
                        'matched_skills': list(matched_skills) if matched_skills else [],
                        'industry_match': industry_match,
                        'profile_picture_url': applicant.get('profile_picture_url', ''),
                        'from_collaborative_filtering': False,
                        'match_type': 'both' if matched_skills and industry_match else 'skills' if matched_skills else 'industry',
                        'influence_tag': 'content'  # Content-based filtering
                    })
                    seen_user_ids.add(user_id)

    # Now, incorporate collaborative filtering by recommending applicants contacted by similar employers
    for contact in contact_history:
        js_user_id = contact.get('js_user_id')
        full_name = contact.get('full_name')
        job_title = contact.get('job_title', "No Job Title")
        profile_picture_url = contact.get('profile_picture_url', '')
        skills = contact.get('skills', [])
        emp_job_listings = contact.get('empjoblistings', [])  # Employer's job listings

        # Check if there's at least one similar job listing between the employer's and the job postings
        has_similar_job_title = any(job_title in job.get('job_title', '') for job in emp_job_listings)

        # Only recommend applicants from contact history if there's a job title match
        if has_similar_job_title and js_user_id not in seen_user_ids:
            contact_matches.append({
                'user_id': js_user_id,
                'full_name': full_name,
                'job_title': job_title,
                'matched_skills': skills,
                'profile_picture_url': profile_picture_url,
                'from_collaborative_filtering': True,
                'match_type': 'collaborative',
                'influence_tag': 'collaborative'  # Collaborative filtering
            })
            seen_user_ids.add(js_user_id)

    # Prioritize candidates: first title matches, then skill matches, then collaborative filtering matches
    recommendations = title_matches + skill_matches + contact_matches

    # Filter recommendations to ensure only those with relevant matches are returned
    recommendations = [
        rec for rec in recommendations 
        if rec['matched_skills'] or rec['industry_match'] or rec['job_title']  # Ensure at least one match exists
    ]

    # Set influence_tag for hybrid matches
    for rec in recommendations:
        # Determine if this recommendation should be hybrid
        if rec['match_type'] == 'both' and rec['from_collaborative_filtering']:
            rec['influence_tag'] = 'hybrid'  # Hybrid filtering

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
