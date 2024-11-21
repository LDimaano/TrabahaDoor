import sys
import json

def preprocess_data(input_data):
    """Extract and validate necessary fields from the input data."""
    try:
        input_json = json.loads(input_data)
        job_postings = input_json.get('job_postings', [])
        applicants = input_json.get('applicants', [])
        contact_history = input_json.get('contact_history', [])
        return job_postings, applicants, contact_history
    except Exception as e:
        raise ValueError(f"Invalid input data: {e}")

def match_title(job, applicant, seen_user_ids):
    """Check if applicant's job title matches job posting."""
    job_title = job.get('job_title', '')
    applicant_titles = applicant.get('job_titles', [])
    if job_title in applicant_titles and applicant.get('user_id') not in seen_user_ids:
        return True
    return False

def match_skills_and_industry(job, applicant, seen_user_ids):
    """Check if there are skill or industry matches."""
    job_skills = set(job.get('required_skills', []))
    job_industry = job.get('industry', '')
    applicant_skills = set(applicant.get('skills', []))
    applicant_industry = applicant.get('industry', '')
    
    matched_skills = job_skills.intersection(applicant_skills)
    industry_match = job_industry == applicant_industry

    if (matched_skills or industry_match) and applicant.get('user_id') not in seen_user_ids:
        return matched_skills, industry_match
    return None, None

def recommend_candidates(job_postings, applicants, contact_history):
    """Generate a list of recommended candidates based on job postings and collaborative filtering."""
    title_matches = []
    skill_matches = []
    contact_matches = []
    seen_user_ids = set()

    # Content-based filtering (job title and skill matches)
    for job in job_postings:
        for applicant in applicants:
            # Check for job title match
            if match_title(job, applicant, seen_user_ids):
                title_matches.append(create_match_dict(job, applicant, 'title', 'content', seen_user_ids))
                continue

            # Check for skill and industry match
            matched_skills, industry_match = match_skills_and_industry(job, applicant, seen_user_ids)
            if matched_skills or industry_match:
                match_type = 'both' if matched_skills and industry_match else ('skills' if matched_skills else 'industry')
                skill_matches.append(create_match_dict(job, applicant, match_type, 'content', seen_user_ids, matched_skills, industry_match))

    # Collaborative filtering (based on contact history)
    for contact in contact_history:
        js_user_id = contact.get('js_user_id')
        if js_user_id not in seen_user_ids:
            contact_matches.append(create_contact_match_dict(contact, seen_user_ids))

    # Combine all matches and filter out empty matches
    recommendations = title_matches + skill_matches + contact_matches
    recommendations = [rec for rec in recommendations if rec['matched_skills'] or rec['industry_match']]

    # Set influence_tag for hybrid matches
    for rec in recommendations:
        if rec['match_type'] == 'both' and rec['from_collaborative_filtering']:
            rec['influence_tag'] = 'hybrid'

    return recommendations

def create_match_dict(job, applicant, match_type, influence_tag, seen_user_ids, matched_skills=None, industry_match=None):
    """Create a recommendation match dictionary."""
    user_id = applicant.get('user_id')
    applicant_full_name = applicant.get('full_name', 'No Name Provided')
    applicant_titles = applicant.get('job_titles', [])
    recommended_job_title = applicant_titles[0] if applicant_titles else "No Job Title"
    
    match_dict = {
        'user_id': user_id,
        'full_name': applicant_full_name,
        'job_title': recommended_job_title,
        'matched_skills': list(matched_skills) if matched_skills else [],
        'industry_match': industry_match,
        'profile_picture_url': applicant.get('profile_picture_url', ''),
        'from_collaborative_filtering': False,
        'match_type': match_type,
        'influence_tag': influence_tag
    }

    seen_user_ids.add(user_id)
    return match_dict

def create_contact_match_dict(contact, seen_user_ids):
    """Create a contact-based recommendation match dictionary."""
    js_user_id = contact.get('js_user_id')
    contact_match_dict = {
        'user_id': js_user_id,
        'full_name': contact.get('full_name'),
        'job_title': contact.get('job_title', 'No Job Title'),
        'matched_skills': contact.get('skills', []),
        'profile_picture_url': contact.get('profile_picture_url', ''),
        'from_collaborative_filtering': True,
        'match_type': 'collaborative',
        'influence_tag': 'collaborative'
    }
    seen_user_ids.add(js_user_id)
    return contact_match_dict

def main(input_data):
    """Main pipeline function to generate recommendations."""
    try:
        job_postings, applicants, contact_history = preprocess_data(input_data)
        recommendations = recommend_candidates(job_postings, applicants, contact_history)
        return json.dumps(recommendations)
    except Exception as e:
        return json.dumps({"error": str(e)})

if __name__ == '__main__':
    input_data = sys.stdin.read()  # Read input data
    print(main(input_data))
