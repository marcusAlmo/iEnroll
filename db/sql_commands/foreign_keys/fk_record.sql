-- invoice_plan
ALTER TABLE record.invoice_plan
    ADD CONSTRAINT fk_invoice_plan_invoice_id FOREIGN KEY (invoice_id) REFERENCES record.invoice(invoice_id) ON UPDATE CASCADE ON DELETE CASCADE;
