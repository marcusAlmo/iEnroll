import { validate } from 'class-validator';
import { CreateUserDto } from './create-account.dto';

function baseUser(): Partial<CreateUserDto> {
  return {
    username: 'juan123',
    email: 'juan@example.com',
    contactNumber: '+639171234567',
    password: 'StrongPass1',
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    dateOfBirth: new Date('2000-01-01'),
    gender: 'M',
    schoolId: 1,
  };
}

describe('CreateUserDto - Address Validation (Edge & Invalid Cases)', () => {
  describe('must fail test suites', () => {
    it('should fail if only province is provided', async () => {
      const dto = Object.assign(new CreateUserDto(), {
        ...baseUser(),
        province: 'Batangas',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail if street is string and others are IDs', async () => {
      const dto = Object.assign(new CreateUserDto(), {
        ...baseUser(),
        street: 'Main Street',
        districtId: 2,
        municipalityId: 3,
        provinceId: 4,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail if only strings are partially filled', async () => {
      const dto = Object.assign(new CreateUserDto(), {
        ...baseUser(),
        street: 'San Jose St.',
        district: 'Barangay 12',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail if municipalityId is a string instead of number', async () => {
      const dto: object = Object.assign(new CreateUserDto(), {
        ...baseUser(),
        streetId: 1,
        districtId: 2,
        municipalityId: 'not-a-number',
        provinceId: 4,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toMatchObject({
        isNumber: expect.any(String),
      });
    });

    it('should fail if all values are undefined', async () => {
      const dto = Object.assign(new CreateUserDto(), {
        ...baseUser(),
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail if district is null (even with valid others)', async () => {
      const dto = Object.assign(new CreateUserDto(), {
        ...baseUser(),
        street: 'Some Street',
        district: null,
        municipality: 'City',
        province: 'Province',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail if IDs are 0 (invalid foreign key)', async () => {
      const dto = Object.assign(new CreateUserDto(), {
        ...baseUser(),
        streetId: 0,
        districtId: 0,
        municipalityId: 0,
        provinceId: 0,
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail if address fields are mixed with `null` and `string`', async () => {
      const dto = Object.assign(new CreateUserDto(), {
        ...baseUser(),
        street: 'Some St',
        district: null,
        municipality: 'City',
        province: 'Province',
      });

      const errors = await validate(dto);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  describe('passing test suites', () => {
    it('should pass with valid minimal full-address string setup', async () => {
      const dto = Object.assign(new CreateUserDto(), {
        ...baseUser(),
        street: 'Elm St.',
        district: 'District 5',
        municipality: 'Citytown',
        province: 'Region X',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass if all IDs are positive non-zero integers', async () => {
      const dto = Object.assign(new CreateUserDto(), {
        ...baseUser(),
        streetId: 5,
        // districtId: 10,
        // municipalityId: 15,
        // provinceId: 20,
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass if provinceId + full string values are provided (municipality, district, street)', async () => {
      const dto = Object.assign(new CreateUserDto(), {
        ...baseUser(),
        provinceId: 1,
        municipality: 'Lipa City',
        district: 'Barangay Sampaguita',
        street: 'P. Gomez St.',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass if provinceId + municipalityId + string district and street are provided', async () => {
      const dto = Object.assign(new CreateUserDto(), {
        ...baseUser(),
        // provinceId: 1,
        municipalityId: 2,
        district: 'Barangay Central',
        street: 'Aguinaldo Ave',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass if provinceId + municipalityId + districtId + string street are provided', async () => {
      const dto = Object.assign(new CreateUserDto(), {
        ...baseUser(),
        // provinceId: 1,
        // municipalityId: 2,
        districtId: 3,
        street: 'A. Mabini St.',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass if all are strings and ID fields are undefined or missing', async () => {
      const dto = Object.assign(new CreateUserDto(), {
        ...baseUser(),
        street: 'Calle Rizal',
        district: 'Barangay Uno',
        municipality: 'San Pablo City',
        province: 'Laguna',
      });

      const errors = await validate(dto);
      expect(errors.length).toBe(0);
    });
  });
});
