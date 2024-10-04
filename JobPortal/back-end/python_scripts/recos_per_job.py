import sys
import json
import logging
import os

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - %(levelname)s - %(message)s')

def recommend_candidates(job_postings, applicants, similar_applicants):
    recommendations = {}

    # Create a dictionary for similar applicants for quick lookup
    similar_applicants_dict = {}
    for similar in similar_applicants:
        user_id = similar['js_user_id']
        if user_id not in similar_applicants_dict:
            similar_applicants_dict[user_id] = []  # Initialize the list
        similar_applicants_dict[user_id].append(similar)

    for job in job_postings:
        job_id = job['job_id']
        required_skills = set(job['required_skills'])
        candidates = []

        # Calculate scores based on skills matching
        for applicant in applicants:
            applicant_id = applicant['user_id']
            applicant_skills = set(applicant['skills'])
            score = len(required_skills.intersection(applicant_skills))  # Score based on skill match

            # Add applicant if they have at least one matching skill
            if score > 0:
                candidates.append({
                    'user_id': applicant_id,
                    'full_name': applicant['full_name'],
                    'email': applicant['email'],
                    # Safely access profile_picture_url
                    'profile_picture_url': applicant.get('profile_picture_url', ''),  # Default to empty string if not found
                    'score': score
                })

        # Sort candidates based on score (number of matched skills)
        candidates.sort(key=lambda x: x['score'], reverse=True)

        # Add similar applicants if available
        for candidate in candidates:
            user_id = candidate['user_id']
            candidate['similar_applicants'] = similar_applicants_dict.get(user_id, [])

        # Ensure candidates list is not empty
        if not candidates:
            candidates = [{'message': 'No skill matches found, but no candidates were available.'}]

        recommendations[job_id] = candidates

    return recommendations

if __name__ == "__main__":
    # Read input from a temporary file
    input_file = sys.argv[1]
    
    if not os.path.exists(input_file):
        logging.error(f"Input file not found: {input_file}")
        sys.exit(1)

    with open(input_file, 'r') as f:
        try:
            data = json.load(f)
            logging.info("Input data loaded successfully.")
            
            job_postings = data['job_postings']
            applicants = data['applicants']
            similar_applicants = data['similar_applicants']
            employer_id = data['employer_id']

            # Log the sizes of input data for debugging
            logging.debug(f"Number of job postings: {len(job_postings)}")
            logging.debug(f"Number of applicants: {len(applicants)}")
            logging.debug(f"Number of similar applicants: {len(similar_applicants)}")

            recommendations = recommend_candidates(job_postings, applicants, similar_applicants)

            # Output recommendations as JSON
            print(json.dumps(recommendations, indent=4))  # Pretty print JSON for better readability

        except json.JSONDecodeError as e:
            logging.error(f"Error decoding JSON: {e}")
            sys.exit(1)
        except Exception as e:
            logging.error(f"An error occurred: {e}")
            sys.exit(1)
