import csv
import json
import os

INPUT_FILE = "crime_dataset_2024_2025.csv"
OUTPUT_FILE = "src/data/initialCrimeData.js"

TYPE_MAPPING = {
    "Aggravated Assault": "violent",
    "Robbery": "violent",
    "Homicide": "violent",
    "Simple Assault": "violent",
    "Violent Disorder": "violent",
    "Burglary": "property",
    "Vandalism": "property",
    "Larceny": "property",
    "Property Theft": "property",
    "Motor Vehicle Theft": "property",
    "Arson": "property",
    "Drug Possession": "drug",
    "Drug Trafficking": "drug",
    "Narcotics Distribution": "drug",
    "Public Intoxication": "public",
    "Disorderly Conduct": "public",
    "Fraud": "financial",
    "Loitering": "public",
    "Traffic Violation": "traffic"
}

def convert():
    if not os.path.exists(INPUT_FILE):
        print(f"Error: {INPUT_FILE} not found.")
        return

    data = []
    with open(INPUT_FILE, 'r') as f:
        reader = csv.DictReader(f)
        for i, row in enumerate(reader):
            crime_type = row.get("Crime_Type")
            category = TYPE_MAPPING.get(crime_type, "other")
            
            try:
                lat = float(row.get("Latitude"))
                lng = float(row.get("Longitude"))
            except ValueError:
                continue

            record = {
                "id": str(i + 1),
                "type": crime_type,
                "category": category,
                "date": row.get("Date"),
                "time": row.get("Time"),
                "location": row.get("Address") or row.get("District"),
                "coordinates": [lat, lng],
                "severity": "High" if category in ["violent", "drug"] else "Medium", # Simplified logic
                "status": row.get("Status"),
                "description": row.get("Description")
            }
            data.append(record)

    # Ensure directory exists
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

    with open(OUTPUT_FILE, 'w') as f:
        f.write("export const initialCrimeData = ")
        json.dump(data, f, indent=2)
        f.write(";\n")

    print(f"Successfully converted {len(data)} records to {OUTPUT_FILE}")

if __name__ == "__main__":
    convert()
