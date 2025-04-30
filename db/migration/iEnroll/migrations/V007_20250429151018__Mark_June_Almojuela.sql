-- Active: 1741359524712@@rt8-2.h.filess.io@5433@iEnroll_ballthembe
CREATE TABLE enrollment.fee_type  (
    fee_type_id INT GENERATED ALWAYS AS IDENTITY NOT NULL,
    fee_type VARCHAR(100) NOT  NULL, 
    creation_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_datetime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT pk_fee_type PRIMARY KEY(fee_type_id),
    CONSTRAINT uq_fee_type UNIQUE(fee_type)
);

INSERT INTO enrollment.fee_type(fee_type)
VALUES ('Basic Fee'), ('Miscellaneous Fee');

ALTER TABLE enrollment.enrollment_fee
ADD COLUMN fee_type_id INT NOT NULL DEFAULT 1;

ALTER TABLE enrollment.enrollment_fee
ALTER COLUMN fee_type_id DROP DEFAULT;

ALTER TABLE enrollment.enrollment_fee
ADD CONSTRAINT fk_enrollment_fee_fee_type_id
FOREIGN KEY(fee_type_id) REFERENCES enrollment.fee_type(fee_type_id);

CREATE TRIGGER t_update_fee_type
    BEFORE UPDATE 
    ON enrollment.fee_type
    FOR EACH ROW
    EXECUTE FUNCTION system.fn_update_datetime();