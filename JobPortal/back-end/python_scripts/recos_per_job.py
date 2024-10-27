import sys
import json

def score_to_stars(score):
    """Convert a similarity score to a star rating."""
    if score <= 0:
        return 0
    elif score <= 2:
        return 1
    elif score <= 4:
        return 2
    elif score <= 6:
        return 3
    elif score <= 8:
        return 4
    else:
        return 5

def calculate_similarity_rating(has_title_match, has_skill_match, has_industry_match, num_matched_skills):
    rating = 0
    if has_title_match:
        rating += 3  # Title match contributes more to the score
    if has_skill_match:
        rating += min(num_matched_skills, 2)  # Skill matches contribute up to 2
    if has_industry_match:
        rating += 1  # Industry match contributes 1
    return rating

def recommend_candidates(job_postings, applicants):
    recommendations_with_title_match = {}
    recommendations_with_skill_match = {}
    recommendations_with_industry_match = {}
    seen_user_ids = set()  # Track user IDs already added to avoid duplicates

    for job in job_postings:
        job_skills = set(job.get('required_skills', []))
        job_title = job.get('job_title', 'No Job Title Provided')
        job_industry = job.get('industry', 'No Industry Provided')  # Industry field of job posting

        for applicant in applicants:
            user_id = applicant.get('user_id')
            if user_id in seen_user_ids:
                continue  # Skip if this user_id has already been added

            applicant_titles = applicant.get('job_titles', [])
            applicant_skills = set(applicant.get('skills', []))
            applicant_industry = applicant.get('industry', '')
            applicant_full_name = applicant.get('full_name', 'No Name Provided')

            # Check for job title match
            has_title_match = job_title in applicant_titles

            # Check for skill match
            matched_skills = job_skills.intersection(applicant_skills)
            has_skill_match = bool(matched_skills)
            num_matched_skills = len(matched_skills)

            # Check for industry match if no title or skill match
            has_industry_match = (job_industry == applicant_industry)

            # Calculate similarity rating
            similarity_rating = calculate_similarity_rating(has_title_match, has_skill_match, has_industry_match, num_matched_skills)

            # Convert similarity rating to stars
            star_rating = score_to_stars(similarity_rating)

            recommendation_data = {
                'user_id': user_id,
                'full_name': applicant_full_name,
                'job_title': job_title,
                'recommended_job_title': applicant_titles[0] if applicant_titles else "No Job Title",
                'matched_skills': list(matched_skills),
                'similarity_rating': similarity_rating,  # Add similarity rating
                'star_rating': star_rating,  # Add star rating
                'profile_picture_url': applicant.get('profile_picture_url', ''),
                'email': applicant.get('email', ''),
                'phone_number': applicant.get('phone_number', ''),
                'additional_info': applicant.get('additional_info', ''),
                'status': applicant.get('status', ''),
                'date_applied': applicant.get('date_applied', ''),
                'application_id': applicant.get('application_id', ''),
            }

            # Add to the highest-priority match category
            if has_title_match:
                recommendations_with_title_match[user_id] = recommendation_data
                seen_user_ids.add(user_id)
            elif has_skill_match:
                recommendations_with_skill_match[user_id] = recommendation_data
                seen_user_ids.add(user_id)
            elif has_industry_match:
                recommendations_with_industry_match[user_id] = recommendation_data
                seen_user_ids.add(user_id)

    # Combine recommendations with priority: title matches, then skill matches, then industry matches
    combined_recommendations = (
        list(recommendations_with_title_match.values()) +
        list(recommendations_with_skill_match.values()) +
        list(recommendations_with_industry_match.values())
    )
    return combined_recommendations

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
