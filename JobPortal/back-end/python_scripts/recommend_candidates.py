import sys
import json

def recommend_candidates(job_postings, applicants, contact_history, current_employer_industry, current_employer_job_titles):
    """Generate a list of recommended candidates based on job postings and collaborative filtering by contact history."""
    title_matches = []
    skill_matches = []
    contact_matches = []
    education_matches = []  # For recommending candidates by education
    industry_based_matches = []  # For recommending candidates by industry
    seen_user_ids = set()

    for job in job_postings:
        job_skills = set(job.get('required_skills', []))
        job_industry = job.get('industry', '')
        job_title = job.get('job_title', '')
        job_education = set(job.get('education', []))  # Job education requirements

        for applicant in applicants:
            applicant_titles = applicant.get('job_titles', [])
            applicant_skills = set(applicant.get('skills', []))
            applicant_education = set(applicant.get('js_education', []))  # Applicant education background
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
                    'matched_education': list(job_education.intersection(applicant_education)),
                    'industry_match': job_industry == applicant_industry,
                    'profile_picture_url': applicant.get('profile_picture_url', ''),
                    'from_collaborative_filtering': False,
                    'match_type': 'title',
                    'influence_tag': 'content',
                    'match_score': 3  # Assign a higher score for title match
                })
                seen_user_ids.add(user_id)
                continue

            # Check for skill, education, and industry matches
            matched_skills = job_skills.intersection(applicant_skills)
            matched_education = job_education.intersection(applicant_education)
            industry_match = job_industry == applicant_industry

            # Ensure at least two skill matches, one industry match, or one education match
            if len(matched_skills) >= 2 or industry_match or matched_education:
                if user_id not in seen_user_ids:
                    recommended_job_title = applicant_titles[0] if applicant_titles else "No Job Title"
                    skill_matches.append({
                        'user_id': user_id,
                        'full_name': applicant_full_name,
                        'job_title': recommended_job_title,
                        'matched_skills': list(matched_skills),
                        'matched_education': list(matched_education),
                        'industry_match': industry_match,
                        'profile_picture_url': applicant.get('profile_picture_url', ''),
                        'from_collaborative_filtering': False,
                        'match_type': 'education' if matched_education else 'both' if matched_skills and industry_match else 'skills' if matched_skills else 'industry',
                        'influence_tag': 'content',
                        'match_score': len(matched_skills) * 2 + len(matched_education)  # Score based on skill and education match count
                    })
                    seen_user_ids.add(user_id)

            # If education match is found, add to education matches
            if matched_education and user_id not in seen_user_ids:
                education_matches.append({
                    'user_id': user_id,
                    'full_name': applicant_full_name,
                    'job_title': recommended_job_title,
                    'matched_education': list(matched_education),
                    'profile_picture_url': applicant.get('profile_picture_url', ''),
                    'from_collaborative_filtering': False,
                    'match_type': 'education',
                    'influence_tag': 'content',
                    'match_score': len(matched_education)  # Score based on education match count
                })
                seen_user_ids.add(user_id)

    # Collaborative filtering logic (remains unchanged)
    for contact in contact_history:
        emp_industry = contact.get('industry_name', '')
        emp_job_listings = set(contact.get('empjoblistings', []))
        js_user_id = contact.get('js_user_id')
        full_name = contact.get('full_name')
        job_title = contact.get('job_title', "No Job Title")
        profile_picture_url = contact.get('profile_picture_url', '')
        skills = contact.get('skills', [])

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
                    'influence_tag': 'collaborative',
                    'match_score': 1  # Assign a lower score for collaborative match
                })
                seen_user_ids.add(js_user_id)

    # Combine results with priority: title matches > skill matches > education matches > contact matches > industry-based matches
    recommendations = title_matches + skill_matches + education_matches + contact_matches + industry_based_matches

    # Filter out duplicates or irrelevant entries
    recommendations = [
        rec for rec in recommendations
        if rec['matched_skills'] or rec['matched_education'] or rec['industry_match'] or rec['job_title']
    ]

    # Sort by match_score in descending order to prioritize higher skill and education matches
    recommendations = sorted(recommendations, key=lambda rec: rec['match_score'], reverse=True)

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
