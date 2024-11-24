import sys
import json

def recommend_candidates(job_postings, applicants):
    recommendations = []
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

            # Check matches
            has_title_match = job_title in applicant_titles
            matched_skills = job_skills.intersection(applicant_skills)
            skill_match_count = len(matched_skills)
            has_skill_match = skill_match_count > 0
            has_industry_match = (job_industry == applicant_industry)
            has_salary_match = any(
                job_salary_range[0] <= salary <= job_salary_range[1]
                for salary in applicant_salary_expectations
            )

            # Calculate total matches
            total_matches = sum([
                has_title_match,
                has_skill_match,
                has_industry_match,
                has_salary_match
            ])

            recommendation_data = {
                'user_id': user_id,
                'full_name': applicant_full_name,
                'job_title': job_title,
                'recommended_job_title': applicant_titles[0] if applicant_titles else "No Job Title",
                'matched_skills': list(matched_skills),
                'skill_match_count': skill_match_count,
                'profile_picture_url': applicant.get('profile_picture_url', ''),
                'email': applicant.get('email', ''),
                'phone_number': applicant.get('phone_number', ''),
                'additional_info': applicant.get('additional_info', ''),
                'status': applicant.get('status', ''),
                'date_applied': applicant.get('date_applied', ''),
                'application_id': applicant.get('application_id', ''),
                'salary': applicant_salary_expectations,
                'total_matches': total_matches,  # Add match count
            }

            # Assign priority
            if total_matches == 4:  # All criteria match
                priority = 1
            elif has_title_match and has_salary_match:
                priority = 2
            elif has_title_match:
                priority = 3
            elif has_skill_match and has_salary_match:
                priority = 4
            elif has_skill_match:
                priority = 5
            elif has_industry_match and has_salary_match:
                priority = 6
            elif has_industry_match:
                priority = 7
            else:
                continue  # Skip if no match

            recommendation_data['priority'] = priority
            recommendations.append(recommendation_data)
            seen_user_ids.add(user_id)

    # Global sort: Priority first, then total matches, then skill match count
    recommendations.sort(
        key=lambda x: (x['priority'], -x['total_matches'], -x['skill_match_count'])
    )

    return recommendations


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
