/**
 * Enums
 */
const Enums = {
    accepted_data_type: {
        string: "string",
        number: "number",
        date: "date",
        image: "image",
        document: "document",
    } as const,

    access_type: {
        public: "public",
        limited: "limited",
        restricted: "restricted",
    } as const,

    application_status: {
        pending: "pending",
        accepted: "accepted",
        denied: "denied",
        invalid: "invalid",
    } as const,

    attachment_status: {
        pending: "pending",
        accepted: "accepted",
        invalid: "invalid",
    } as const,

    attachment_type: {
        document: "document",
        image: "image",
        text: "text",
    } as const,

    gender: {
        male: "male",
        female: "female",
        other: "other",
    } as const,

    requirement_type: {
        document: "document",
        image: "image",
        text: "text",
    } as const,

    school_type: {
        public: "public",
        private: "private",
        others: "others",
    } as const,

    payment_option: {
        credit_card: "credit_card",
        debit_card: "debit_card",
        e_wallet: "e_wallet",
        bank_transfer: "bank_transfer",
        crypto: "crypto",
    } as const,
};

export default Enums;

export type accepted_data_type = typeof Enums.accepted_data_type[keyof typeof Enums.accepted_data_type];
export type access_type = typeof Enums.access_type[keyof typeof Enums.access_type];
export type application_status = typeof Enums.application_status[keyof typeof Enums.application_status];
export type attachment_status = typeof Enums.attachment_status[keyof typeof Enums.attachment_status];
export type attachment_type = typeof Enums.attachment_type[keyof typeof Enums.attachment_type];
export type gender = typeof Enums.gender[keyof typeof Enums.gender];
export type requirement_type = typeof Enums.requirement_type[keyof typeof Enums.requirement_type];
export type school_type = typeof Enums.school_type[keyof typeof Enums.school_type];
export type payment_option = typeof Enums.payment_option[keyof typeof Enums.payment_option];
