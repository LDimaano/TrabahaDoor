import sys
import json

def recommend_candidates(job_postings, applicants):
    recommendations_with_title_and_salary_match = {}
    recommendations_with_title_match = {}
    recommendations_with_skill_and_salary_match = {}
    recommendations_with_skill_match = {}
    recommendations_with_industry_and_salary_match = {}
    recommendations_with_industry_match = {}
    seen_user_ids = set()

    for job in job_postings:
        job_skills = set(job.get('required_skills', []))
        job_title = job.get('job_title', 'No Job Title Provided')
        job_industry = job.get('industry', 'No Industry Provided')
        job_salary_range = job.get('salary_range', [0, 0])

        for applicant in applicants:
            user_id = applicant.get('user_id')
            if user_id in seen_user_ids:
                continue

            applicant_titles = applicant.get('job_titles', [])
            applicant_skills = set(applicant.get('skills', []))
            applicant_industry = applicant.get('industry', '')
            applicant_full_name = applicant.get('full_name', 'No Name Provided')
            applicant_salary_expectations = applicant.get('salary', [0])

            # Check for job title match
            has_title_match = job_title in applicant_titles

            # Count the number of matched skills
            matched_skills = job_skills.intersection(applicant_skills)
            skill_match_count = len(matched_skills)

            # Check for other matches
            has_skill_match = skill_match_count > 0
            has_industry_match = (job_industry == applicant_industry)
            has_salary_match = any(
                job_salary_range[0] <= salary <= job_salary_range[1]
                for salary in applicant_salary_expectations
            )

            recommendation_data = {
                'user_id': user_id,
                'full_name': applicant_full_name,
                'job_title': job_title,
                'recommended_job_title': applicant_titles[0] if applicant_titles else "No Job Title",
                'matched_skills': list(matched_skills),
                'skill_match_count': skill_match_count,  # Include skill match count
                'profile_picture_url': applicant.get('profile_picture_url', ''),
                'email': applicant.get('email', ''),
                'phone_number': applicant.get('phone_number', ''),
                'additional_info': applicant.get('additional_info', ''),
                'status': applicant.get('status', ''),
                'date_applied': applicant.get('date_applied', ''),
                'application_id': applicant.get('application_id', ''),
                'salary': applicant_salary_expectations,
            }

            # Prioritize based on matches
            if has_title_match and has_salary_match:
                recommendations_with_title_and_salary_match[user_id] = recommendation_data
                seen_user_ids.add(user_id)
            elif has_title_match:
                recommendations_with_title_match[user_id] = recommendation_data
                seen_user_ids.add(user_id)
            elif has_skill_match and has_salary_match:
                recommendations_with_skill_and_salary_match[user_id] = recommendation_data
                seen_user_ids.add(user_id)
            elif has_skill_match:
                recommendations_with_skill_match[user_id] = recommendation_data
                seen_user_ids.add(user_id)
            elif has_industry_match and has_salary_match:
                recommendations_with_industry_and_salary_match[user_id] = recommendation_data
                seen_user_ids.add(user_id)
            elif has_industry_match:
                recommendations_with_industry_match[user_id] = recommendation_data
                seen_user_ids.add(user_id)

    # Combine recommendations with priority:
    # Title with salary > Title > Skill with salary > Skill > Industry with salary > Industry
    combined_recommendations = (
        list(recommendations_with_title_and_salary_match.values()) +
        list(recommendations_with_title_match.values()) +
        sorted(recommendations_with_skill_and_salary_match.values(), key=lambda x: x['skill_match_count'], reverse=True) +
        sorted(recommendations_with_skill_match.values(), key=lambda x: x['skill_match_count'], reverse=True) +
        list(recommendations_with_industry_and_salary_match.values()) +
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