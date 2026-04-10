import csv
import json
import os

INPUT_FILE = 'crime_dataset_large.csv'
OUTPUT_FILE = 'src/data/initialCrimeData.js'

# Mapping for simple category logic
TYPE_MAPPING = {
    "Theft": "property",
    "Assault": "violent",
    "Burglary": "property",
    "Vandalism": "property",
    "Fraud": "financial",
    "Drug Offense": "drug",
    "Homicide": "violent",
    "Robbery": "violent",
    "Cybercrime": "cyber",
    "Traffic Violation": "traffic",
    "Public Intoxication": "public",
    "Disorderly Conduct": "public",
    "Property Crime": "property"
}

def convert():
    if not os.path.exists(INPUT_FILE):
        print(f"Error: {INPUT_FILE} not found.")
        return

    data = []
    try:
        with open(INPUT_FILE, 'r', encoding='utf-8') as f:
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
                    "severity": "High" if category in ["violent", "drug"] else "Medium",
                    "status": row.get("Status"),
                    "description": row.get("Description")
                }
                data.append(record)
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return

    # Ensure directory exists
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write("export const initialCrimeData = ")
        json.dump(data, f, indent=2)
        f.write(";\n")
    
    print(f"Successfully converted {len(data)} records to {OUTPUT_FILE}")

if __name__ == "__main__":
    convert()
