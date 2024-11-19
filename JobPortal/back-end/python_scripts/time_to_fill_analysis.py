import sys
import json
from datetime import datetime
from collections import defaultdict
import matplotlib.pyplot as plt

def calculate_time_to_fill(data):
    # Dictionary to store time to fill by industry
    industry_time_to_fill = defaultdict(list)

    # Iterate through job listings and calculate days to fill for each industry
    for job in data:
        industry = job['industry_name'].strip()  # Accessing industry_name from the data
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

def plot_time_to_fill(result):
    # Extract industries and their average time to fill
    industries = list(result.keys())
    avg_time_to_fill = list(result.values())

    # Create a bar chart
    plt.figure(figsize=(12, 6))  # Adjust the figure size for better visibility
    bars = plt.bar(industries, avg_time_to_fill, color='skyblue')

    # Set chart labels and title
    plt.xlabel('Industry')
    plt.ylabel('Average Time to Fill (Days)')
    plt.title('Average Time to Fill by Industry')

    # Rotate industry names for better visibility
    plt.xticks(rotation=45, ha='right', fontsize=10)

    # Adjust layout to avoid clipping labels
    plt.tight_layout()

    # Display the plot
    plt.show()

if __name__ == "__main__":
    try:
        # Read input data from stdin
        input_data = sys.stdin.read()
        if not input_data.strip():  # Check if input data is empty
            raise ValueError("No input data received.")
        
        job_listings = json.loads(input_data)

        # Calculate time to fill by industry without scaling
        result = calculate_time_to_fill(job_listings)

        # Plot the result (this could be a separate function depending on how you want to handle plots)
        plot_time_to_fill(result)

        # Output result as JSON
        print(json.dumps(result))
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)  # Log any error to stderr
        print(json.dumps({"error": str(e)}))  # Return error as JSON
