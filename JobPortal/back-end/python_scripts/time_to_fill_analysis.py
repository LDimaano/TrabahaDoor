import sys
import json
from datetime import datetime
from collections import defaultdict

def calculate_time_to_fill(data):
    industry_time_to_fill = defaultdict(list)

    # Iterate through job listings and calculate days to fill for each industry
    for job in data:
        industry = job['industry_name'] 
        datecreated = datetime.strptime(job['datecreated'], '%Y-%m-%dT%H:%M:%S.%fZ').date()
        datefilled = datetime.strptime(job['datefilled'], '%Y-%m-%dT%H:%M:%S.%fZ').date()
        days_to_fill = (datefilled - datecreated).days
        
        # Append the time to fill for each job to the respective industry
        industry_time_to_fill[industry].append(days_to_fill)

    # Average the days to fill for each industry
    industry_avg_time_to_fill = {
        industry: sum(days) // len(days) for industry, days in industry_time_to_fill.items()
    }

    return industry_avg_time_to_fill

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