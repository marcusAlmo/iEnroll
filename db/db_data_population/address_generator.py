import random 
from faker import Faker

fake = Faker('en_PH')  # Use Philippines locale

# Philippine provinces with their cities/municipalities
PH_LOCATIONS = {
    'Metro Manila': ['Manila', 'Quezon City', 'Makati', 'Taguig', 'Pasig', 'Parañaque'],
    'Cebu': ['Cebu City', 'Mandaue', 'Lapu-Lapu', 'Talisay', 'Carcar'],
    'Davao': ['Davao City', 'Digos', 'Tagum', 'Panabo', 'Mati'],
    'Bicol': ['Legazpi', 'Naga', 'Sorsogon', 'Masbate City', 'Tabaco'],
    'Pangasinan': ['Dagupan', 'Alaminos', 'Urdaneta', 'San Carlos', 'Lingayen'],
    'Pampanga': ['San Fernando', 'Angeles', 'Mabalacat', 'Lubao', 'Guagua']
}

def generate_address(cursor):
    """
    Generates an address for a new school using Philippine locations
    
    Args:
        cursor: Database cursor from the main module
    Returns:
        int: The generated address_id if successful, None if failed
    """
    try:
        # Select random province and municipality
        province = random.choice(list(PH_LOCATIONS.keys()))
        municipality = random.choice(PH_LOCATIONS[province])
        
        # Generate address details
        address_line_1 = f"{random.randint(1, 9999)} {fake.street_name()}"
        street = fake.street_name()
        district = f"District {random.randint(1, 12)}"
        
        cursor.execute("""
            INSERT INTO enrollment.address (address_line_1, street, district, municipality, province)
            VALUES (%s, %s, %s, %s, %s)
            RETURNING address_id
        """, (address_line_1, street, district, municipality, province))
        
        address_id = cursor.fetchone()[0]
        print(f"Generated address in {municipality}, {province}")
        return address_id
        
    except Exception as e:
        print(f"Error generating address: {str(e)}")
        return None
