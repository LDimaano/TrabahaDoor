import sys
import json

def recommend_candidates(job_postings, applicants, contact_history, current_employer_industry, current_employer_job_titles):
    """Generate a list of recommended candidates based on job postings and collaborative filtering by contact history."""
    title_matches = []
    skill_matches = []
    contact_matches = []
    seen_user_ids = set()

    for job in job_postings:
        job_skills = set(job.get('required_skills', []))
        job_industry = job.get('industry', '')
        job_title = job.get('job_title', '')  

        for applicant in applicants:
            applicant_titles = applicant.get('job_titles', [])
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
                    'influence_tag': 'content'  
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
                        'influence_tag': 'content'  
                    })
                    seen_user_ids.add(user_id)

    # incorporate collaborative filtering by recommending applicants contacted by similar employers
    for contact in contact_history:
        emp_industry = contact.get('industry_name', '')  
        emp_job_listings = set(contact.get('empjoblistings', [])) 
        js_user_id = contact.get('js_user_id')
        full_name = contact.get('full_name')
        job_title = contact.get('job_title', "No Job Title")
        profile_picture_url = contact.get('profile_picture_url', '')
        skills = contact.get('skills', [])

        # Ensure the employer is in the same industry and has at least one similar job listing
        if emp_industry == current_employer_industry and len(emp_job_listings.intersection(current_employer_job_titles)) > 0:
            if js_user_id not in seen_user_ids:
                contact_matches.append({
                    'user_id': js_user_id,
                    'full_name': full_name,
                    'job_title': job_title,
                    'matched_skills': skills,
                    'profile_picture_url': profile_picture_url,
                    'from_collaborative_filtering': True,
                    'match_type': 'collaborative',
                    'influence_tag': 'collaborative' 
                })
                seen_user_ids.add(js_user_id)

    # Prioritize candidates: first title matches, then skill matches, then collaborative filtering matches
    recommendations = title_matches + skill_matches + contact_matches

    recommendations = [
        rec for rec in recommendations 
        if rec['matched_skills'] or rec['industry_match'] or rec['job_title'] 
    ]

    for rec in recommendations:
        if rec['match_type'] == 'both' and rec['from_collaborative_filtering']:
            rec['influence_tag'] = 'hybrid'  

    return recommendations

if __name__ == '__main__':
    try:
        input_data = sys.stdin.read()
        input_json = json.loads(input_data)
        job_postings = input_json.get('job_postings', [])
        applicants = input_json.get('applicants', [])
        contact_history = input_json.get('contact_history', [])
        current_employer_industry = input_json.get('current_employer_industry', '')
        current_employer_job_titles = set(input_json.get('current_employer_job_titles', []))

        # Generate recommendations
        recommended_candidates = recommend_candidates(job_postings, applicants, contact_history, current_employer_industry, current_employer_job_titles)

        print(json.dumps(recommended_candidates))
        sys.exit(0)

    except Exception as e:
        print(f'Unexpected error occurred: {str(e)}', file=sys.stderr)
        sys.exit(1)
