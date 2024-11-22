import sys
import json
from datetime import datetime
from collections import defaultdict

def calculate_time_to_fill(data):
    job_title_time_to_fill = defaultdict(list)

    # Iterate through job listings and calculate days to fill for each job title
    for job in data:
        try:
            filled_count = int(job['filled_count'])  
            positions = int(job['positions'])  

            # Only consider jobs that are fully filled
            if filled_count >= positions:
                job_title = job['job_title'] 
                datecreated = datetime.strptime(job['datecreated'], '%Y-%m-%dT%H:%M:%S.%fZ').date()
                datefilled = datetime.strptime(job['datefilled'], '%Y-%m-%dT%H:%M:%S.%fZ').date()
                days_to_fill = (datefilled - datecreated).days

                # Append the time to fill for each job to the respective job title
                job_title_time_to_fill[job_title].append(days_to_fill)
        except (ValueError, KeyError) as e:
            print(f"Skipping job due to error: {e}", file=sys.stderr)
            print(f"Job data: {job}", file=sys.stderr)

    # Average the days to fill for each job title
    job_title_avg_time_to_fill = {
        job_title: sum(days) // len(days) for job_title, days in job_title_time_to_fill.items()
    }

    return job_title_avg_time_to_fill

if __name__ == "__main__":
    try:
        input_data = sys.stdin.read()
        if not input_data.strip():
            raise ValueError("No input data received.")
        
        job_listings = json.loads(input_data)
        result = calculate_time_to_fill(job_listings)
        print(json.dumps(result))
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        print(json.dumps({"error": str(e)}))
