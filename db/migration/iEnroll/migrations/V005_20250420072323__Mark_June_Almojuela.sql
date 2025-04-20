-- CLEAR ADDRESS TABLE
TRUNCATE TABLE enrollment.address CASCADE;

-- RENAME STREET COLUMN
ALTER TABLE enrollment.address 
RENAME COLUMN street TO street_id;

-- CONVERT STREET_ID TO INT
ALTER TABLE enrollment.address 
ALTER COLUMN street_id TYPE INT USING street_id::INT;

-- DROP DISTRICT, MUNICIPALITY, PROVINCE COLUMNS
ALTER TABLE enrollment.address 
DROP COLUMN district,
DROP COLUMN municipality,
DROP COLUMN province;

-- ADD STREET TABLE
CREATE TABLE system.street(
    street_id INT GENERATED ALWAYS AS IDENTITY NOT NULL,
    street VARCHAR(100) NOT NULL,
    district_id INT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE NOT NULL,

    CONSTRAINT pk_street PRIMARY KEY(street_id),
    CONSTRAINT uq_street_district UNIQUE(street, district_id)
);

-- ADD DISTRICT TABLE
CREATE TABLE system.district(
    district_id INT GENERATED ALWAYS AS IDENTITY NOT NULL,
    district VARCHAR(100) NOT NULL,
    municipality_id INT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE NOT NULL,

    CONSTRAINT pk_district PRIMARY KEY(district_id),
    CONSTRAINT uq_district_municipality UNIQUE(district, municipality_id)
);

-- ADD MUNICIPALITY TABLE
CREATE TABLE system.municipality(
    municipality_id INT GENERATED ALWAYS AS IDENTITY NOT NULL,
    municipality VARCHAR(100) NOT NULL,
    province_id INT NOT NULL,
    is_default BOOLEAN NOT NULL,

    CONSTRAINT pk_municipality PRIMARY KEY(municipality_id),
    CONSTRAINT uq_municipality_province UNIQUE(municipality, province_id)
);

-- ADD PROVINCE TABLE
CREATE TABLE system.province(
    province_id INT NOT NULL GENERATED ALWAYS AS IDENTITY,
    province VARCHAR(100) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE NOT NULL,

    CONSTRAINT pk_province PRIMARY KEY(province_id),
    CONSTRAINT uq_province UNIQUE(province)
);

-- ADD FOREIGN KEYS
ALTER TABLE enrollment.address
ADD CONSTRAINT fk_address_street_id 
FOREIGN KEY(street_id) REFERENCES system.street(street_id)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE system.street
ADD CONSTRAINT fk_street_district_id
FOREIGN KEY(district_id) REFERENCES system.district(district_id)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE system.district
ADD CONSTRAINT fk_district_municipality_id
FOREIGN KEY(municipality_id) REFERENCES system.municipality(municipality_id)
ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE system.municipality
ADD CONSTRAINT fk_municipality_province_id
FOREIGN KEY(province_id) REFERENCES system.province(province_id)
ON UPDATE CASCADE ON DELETE RESTRICT;

-- ADD SUPPORTED ACAD LEVELS IN SCHOOL RELATION
ALTER TABLE enrollment.school 
ADD COLUMN supported_acad_level JSONB;