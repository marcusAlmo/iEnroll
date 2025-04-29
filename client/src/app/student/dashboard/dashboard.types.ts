export type EnrollmentStatus = {
  status: "Pending" | "None" | "Enrolled" | string;
  description?: Description; // Optional for when the status is "Enrolled"
};

export type StatusContent = {
  statusLabel: string;
  statusLabelColor: string; // Color of the badge
  description?: string | Description;  // Description below the status badge
  actionText?: string; // "Click here to see required documents", "Click here to apply"
  action?: () => void; // For navigation, etc.
};

export type Description = {
  programName: string;
  year: number;
  paymentStatus: string | Date;
};

export type ReuploadDocuments = {
  documentName: string;
  action: () => void;
}