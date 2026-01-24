import csv
import random
from datetime import datetime, timedelta

# Configuration
START_DATE = datetime(2024, 1, 1)
END_DATE = datetime(2025, 12, 31)
NUM_RECORDS = 5000
OUTPUT_FILE = "crime_dataset_2024_2025.csv"

# Crime Categories and Types
CRIME_TYPES = {
    "Violent": ["Aggravated Assault", "Robbery", "Homicide", "Simple Assault", "Violent Disorder"],
    "Property": ["Burglary", "Vandalism", "Larceny", "Property Theft", "Motor Vehicle Theft", "Arson"],
    "Drug": ["Drug Possession", "Drug Trafficking", "Narcotics Distribution"],
    "Other": ["Public Intoxication", "Disorderly Conduct", "Fraud", "Loitering", "Traffic Violation"]
}

# Weights for distribution (Violent, Property, Drug, Other)
CATEGORY_WEIGHTS = [0.25, 0.45, 0.15, 0.15] 

DISTRICTS = ["Central", "North", "South", "West", "East", "Downtown", "Uptown", "Suburban"]
STATUSES = ["Active", "Closed", "Under Investigation", "Cleared by Arrest"]

# Chicago-ish coordinates
LAT_BASE = 41.8781
LON_BASE = -87.6298

def random_date(start, end):
    delta = end - start
    random_days = random.randrange(delta.days)
    return start + timedelta(days=random_days)

def random_time():
    h = random.randint(0, 23)
    m = random.randint(0, 59)
    s = random.randint(0, 59)
    return f"{h:02d}:{m:02d}:{s:02d}"

def generate_data():
    records = []
    
    # Generate headers
    headers = [
        "Date", "Time", "Crime_Type", "Latitude", "Longitude", 
        "Address", "District", "Description", "Status", "Response_Time_Minutes"
    ]
    
    records.append(headers)

    for i in range(NUM_RECORDS):
        # 1. Date & Time
        date_obj = random_date(START_DATE, END_DATE)
        date_str = date_obj.strftime("%Y-%m-%d")
        time_str = random_time()

        # 2. Crime Type
        category = random.choices(list(CRIME_TYPES.keys()), weights=CATEGORY_WEIGHTS, k=1)[0]
        crime_type = random.choice(CRIME_TYPES[category])

        # 3. Location
        # Add small random variation to base coordinates
        lat = LAT_BASE + random.uniform(-0.1, 0.1)
        lon = LON_BASE + random.uniform(-0.1, 0.1)
        
        street_num = random.randint(100, 9999)
        street_names = ["Main St", "Oak Ave", "Maple Dr", "Washington Blvd", "Broadway", "Park Ln", "Cedar St", "Elm St"]
        address = f"{street_num} {random.choice(street_names)}"
        
        district = random.choice(DISTRICTS)

        # 4. Description & Status
        description = f"Reported {crime_type.lower()} incident at {address}."
        status = random.choice(STATUSES)
        
        # 5. Response Time
        response_time = random.randint(5, 60)

        records.append([
            date_str, time_str, crime_type, f"{lat:.4f}", f"{lon:.4f}",
            address, district, description, status, str(response_time)
        ])

    return records

def write_csv(data):
    with open(OUTPUT_FILE, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerows(data)
    print(f"Successfully generated {len(data)-1} records to {OUTPUT_FILE}")

if __name__ == "__main__":
    data = generate_data()
    write_csv(data)
