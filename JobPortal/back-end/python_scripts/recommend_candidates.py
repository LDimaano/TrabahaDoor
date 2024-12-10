import sys
import json

def calculate_weighted_match_score(skill_match, title_match, education_match, salary_match, collaborative_match):
    """Calculate weighted match score, prioritizing title matches over skill matches."""
    weights = {
        'skills': 2,       # Skills match has moderate weight
        'title': 4,        # Job title match has the highest weight
        'education': 1,    # Education match has low weight
        'salary': 1,       # Salary match has low weight
        'collaborative': 1,  # Collaborative filtering match has low weight
    }

    # Weighted score calculation
    match_score = (
        weights['skills'] * skill_match +
        weights['title'] * int(title_match) +
        weights['education'] * int(education_match) +
        weights['salary'] * int(salary_match) +
        weights['collaborative'] * int(collaborative_match)
    )

    return match_score


def calculate_match_percentage(recommendations):
    """Calculate the percentage of the most matches based on overall match score."""
    if not recommendations:
        return recommendations  # Return as-is if no recommendations

    # Find the maximum match score, ensuring non-zero maximum
    max_match_score = max(rec['overall_match_score'] for rec in recommendations if 'overall_match_score' in rec)

    if max_match_score == 0:
        # Avoid division by zero: set all match percentages to 0 if no scores are valid
        for rec in recommendations:
            rec['match_percentage'] = 0.0
    else:
        # Calculate percentage relative to the maximum score
        for rec in recommendations:
            if 'overall_match_score' in rec:
                rec['match_percentage'] = round((rec['overall_match_score'] / max_match_score) * 100, 2)

    return recommendations


def recommend_candidates(job_postings, applicants, contact_history, current_employer_industry, current_employer_job_titles):
    """Generate a list of recommended candidates with weighted match scores and percentages."""
    title_matches = []
    skill_matches = []
    contact_matches = []
    education_matches = []
    industry_based_matches = []
    seen_user_ids = set()

    for job in job_postings:
        job_skills = set(job.get('required_skills', []))
        job_industry = job.get('industry', '')
        job_title = job.get('job_title', '')
        job_education = set(job.get('education', []))  # Job education requirements

        for applicant in applicants:
            applicant_titles = applicant.get('job_titles', [])
            applicant_skills = set(applicant.get('skills', []))
            applicant_education = set(applicant.get('js_education', []))
            applicant_full_name = applicant.get('full_name', 'No Name Provided')
            user_id = applicant.get('user_id')
            applicant_industry = applicant.get('industry', '')

            # Matches
            job_title_match = job_title in applicant_titles
            matched_skills = job_skills.intersection(applicant_skills)
            matched_education = job_education.intersection(applicant_education)
            industry_match = job_industry == applicant_industry
            collaborative_match = False  # Will be checked in contact history
            salary_match = False  # Placeholder; include logic if salary data is available

            if user_id not in seen_user_ids:
                # Calculate weighted match score
                match_score = calculate_weighted_match_score(
                    skill_match=len(matched_skills),
                    title_match=job_title_match,
                    education_match=bool(matched_education),
                    salary_match=salary_match,
                    collaborative_match=collaborative_match
                )

                # Build recommendation record
                recommendation = {
                    'user_id': user_id,
                    'full_name': applicant_full_name,
                    'job_title': applicant_titles[0] if applicant_titles else "No Job Title",
                    'matched_skills': list(matched_skills),
                    'matched_education': list(matched_education),
                    'industry_match': industry_match,
                    'profile_picture_url': applicant.get('profile_picture_url', ''),
                    'from_collaborative_filtering': collaborative_match,
                    'match_type': 'title' if job_title_match else 'skills',
                    'overall_match_score': match_score,
                }

                # Append to appropriate list
                if job_title_match:
                    title_matches.append(recommendation)
                elif len(matched_skills) >= 2 or matched_education or industry_match:
                    skill_matches.append(recommendation)

                seen_user_ids.add(user_id)

    # Collaborative filtering logic
    for contact in contact_history:
        emp_industry = contact.get('industry_name', '')
        emp_job_listings = set(contact.get('empjoblistings', []))
        js_user_id = contact.get('js_user_id')
        full_name = contact.get('full_name')
        job_title = contact.get('job_title', "No Job Title")
        profile_picture_url = contact.get('profile_picture_url', '')

        if emp_industry == current_employer_industry and len(emp_job_listings.intersection(current_employer_job_titles)) > 0:
            if js_user_id not in seen_user_ids:
                contact_matches.append({
                    'user_id': js_user_id,
                    'full_name': full_name,
                    'job_title': job_title,
                    'matched_skills': [],
                    'profile_picture_url': profile_picture_url,
                    'from_collaborative_filtering': True,
                    'match_type': 'collaborative',
                    'overall_match_score': calculate_weighted_match_score(0, 0, 0, 0, True),
                })
                seen_user_ids.add(js_user_id)

    # Combine results while preserving all categories
    recommendations = title_matches + skill_matches + education_matches + contact_matches + industry_based_matches

    # Calculate match percentages for all recommendations
    recommendations = calculate_match_percentage(recommendations)

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

        print(json.dumps(recommended_candidates, indent=4))
        sys.exit(0)

    except Exception as e:
        print(f'Unexpected error occurred: {str(e)}', file=sys.stderr)
        sys.exit(1)
