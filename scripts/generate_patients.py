import json
import random
from faker import Faker

def generate_patient_data(num_patients):
   fake = Faker()
   patients = []
   
   for _ in range(num_patients):
       first_name = fake.first_name()
       last_name = fake.last_name()
       
       patient = {
           "firstName": first_name,
           "lastName": last_name,
           "email": f"{first_name.lower()}.{last_name.lower()}@{fake.free_email_domain()}",
           "phone": fake.phone_number()
       }
       patients.append(patient)
       
   return patients

def save_to_json(patients, filename="patient_data.json"):
   with open(filename, 'w') as f:
       json.dump(patients, f, indent=2)

if __name__ == "__main__":
   num_patients = 50  # Change this number to generate more/less patients
   patient_data = generate_patient_data(num_patients)
   save_to_json(patient_data)
   print(f"Generated {num_patients} patient records in patient_data.json")