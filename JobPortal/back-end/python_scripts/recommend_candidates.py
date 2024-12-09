import sys
import json

def recommend_candidates(job_postings, applicants, contact_history, current_employer_industry, current_employer_job_titles):
    """Generate a list of recommended candidates based on job postings and collaborative filtering with a percentage match."""
    def calculate_weighted_score(skill_match, title_match, education_match, industry_match, collaborative_match):
        weights = {
            'skills': 3,
            'title': 2,
            'education': 1,
            'industry': 1,
            'collaborative': 1
        }
        score = (
            weights['skills'] * skill_match +
            weights['title'] * int(title_match) +
            weights['education'] * int(education_match) +
            weights['industry'] * int(industry_match) +
            weights['collaborative'] * int(collaborative_match)
        )
        return score

    def calculate_match_percentage(recommendations):
        if not recommendations:
            return recommendations
        max_score = max(rec['overall_match_score'] for rec in recommendations)
        for rec in recommendations:
            rec['match_percentage'] = round((rec['overall_match_score'] / max_score) * 100, 2) if max_score > 0 else 0.0
        return recommendations

    title_matches, skill_matches, contact_matches, education_matches, industry_matches = [], [], [], [], []
    seen_user_ids = set()

    for job in job_postings:
        job_skills = set(job.get('required_skills', []))
        job_industry = job.get('industry', '')
        job_title = job.get('job_title', '')
        job_education = set(job.get('education', []))

        for applicant in applicants:
            applicant_skills = set(applicant.get('skills', []))
            applicant_titles = applicant.get('job_titles', [])
            applicant_education = set(applicant.get('js_education', []))
            applicant_industry = applicant.get('industry', '')
            user_id = applicant.get('user_id')
            full_name = applicant.get('full_name', 'No Name Provided')

            if user_id in seen_user_ids:
                continue

            title_match = job_title in applicant_titles
            matched_skills = len(job_skills.intersection(applicant_skills))
            education_match = bool(job_education.intersection(applicant_education))
            industry_match = job_industry == applicant_industry
            collaborative_match = False  # Default unless proven otherwise

            # Calculate weighted score
            overall_score = calculate_weighted_score(
                matched_skills >= 2, title_match, education_match, industry_match, collaborative_match
            )

            if overall_score > 0:
                recommendation = {
                    'user_id': user_id,
                    'full_name': full_name,
                    'job_title': applicant_titles[0] if applicant_titles else "No Job Title",
                    'matched_skills': list(job_skills.intersection(applicant_skills)),
                    'matched_education': list(job_education.intersection(applicant_education)),
                    'industry_match': industry_match,
                    'profile_picture_url': applicant.get('profile_picture_url', ''),
                    'from_collaborative_filtering': collaborative_match,
                    'overall_match_score': overall_score,
                }

                if title_match:
                    title_matches.append(recommendation)
                elif matched_skills >= 2:
                    skill_matches.append(recommendation)
                elif education_match:
                    education_matches.append(recommendation)
                elif industry_match:
                    industry_matches.append(recommendation)

                seen_user_ids.add(user_id)

    # Process collaborative filtering matches
    for contact in contact_history:
        if (
            contact.get('industry_name') == current_employer_industry
            and set(contact.get('empjoblistings', [])).intersection(current_employer_job_titles)
        ):
            collaborative_match = True
            overall_score = calculate_weighted_score(0, False, False, False, collaborative_match)
            if contact.get('js_user_id') not in seen_user_ids:
                contact_matches.append({
                    'user_id': contact['js_user_id'],
                    'full_name': contact['full_name'],
                    'job_title': contact.get('job_title', "No Job Title"),
                    'matched_skills': [],
                    'matched_education': [],
                    'industry_match': False,
                    'profile_picture_url': contact.get('profile_picture_url', ''),
                    'from_collaborative_filtering': collaborative_match,
                    'overall_match_score': overall_score,
                })
                seen_user_ids.add(contact['js_user_id'])

    # Combine all matches and calculate percentages
    recommendations = title_matches + skill_matches + education_matches + contact_matches + industry_matches
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

        recommendations = recommend_candidates(
            job_postings, applicants, contact_history, current_employer_industry, current_employer_job_titles
        )
        print(json.dumps(recommendations))
        sys.exit(0)

    except Exception as e:
        print(f'Error: {str(e)}', file=sys.stderr)
        sys.exit(1)
