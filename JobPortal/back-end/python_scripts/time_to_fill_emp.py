import sys
import json
from datetime import datetime

def calculate_time_to_fill(job_data):
    result = []

    for job in job_data:
        # Only consider jobs that are fully filled
        if job['filled_count'] >= job['positions']:
            date_created = datetime.strptime(job['datecreated'], '%Y-%m-%dT%H:%M:%S.%fZ').date()
            date_filled = datetime.strptime(job['datefilled'], '%Y-%m-%dT%H:%M:%S.%fZ').date()

            # Calculate days to fill
            days_to_fill = (date_filled - date_created).days

            result.append({
                'job_id': job['job_id'],
                'job_title': job['job_title'],
                'days_to_fill': days_to_fill
            })

    return result

if __name__ == "__main__":
    try:
        # Read input from stdin
        input_data = sys.stdin.read()

        if input_data.strip():
            job_data = json.loads(input_data)
            time_to_fill_result = calculate_time_to_fill(job_data)
            print(json.dumps(time_to_fill_result))
        else:
            print(json.dumps({"error": "No data received"}))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
