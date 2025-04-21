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
        cursor.execute("""
            SELECT s.street_id, d.district 
            FROM system.street s
            JOIN system.district d ON s.district_id = d.district_id
            WHERE s.is_default = TRUE
        """)
        street_ids = cursor.fetchall()
        chosen_street_district = random.choice(street_ids)
        street_id = chosen_street_district[0]
        district = chosen_street_district[1]
        
        # Generate address details
        address_line_1 = f"{random.randint(1, 9999)} {fake.street_name()}"
        
        cursor.execute("""
            INSERT INTO enrollment.address (address_line_1, street_id)
            VALUES (%s, %s)
            RETURNING address_id
        """, (address_line_1, street_id))
        
        address_id = cursor.fetchone()[0]
        print(f"Generated address in {district}")
        return [district, address_id]
        
    except Exception as e:
        print(f"Error generating address: {str(e)}")
        return None
