import { useNavigate } from "react-router";

type EnrollmentStatus = {
  status: "Pending" | "None" | "Enrolled";
};

type StatusContent = {
  statusLabel: string;
  statusLabelColor: string; // Color of the badge
  description?: string | Description;  // Description below the status badge
  actionText?: string; // "Click here to see required documents", "Click here to apply"
  action?: () => void; // For navigation, etc.
};

type Description = {
  programName: string;
  year: number;
  paymentStatus: string | Date;
};

const StatusBox = ({ status }: EnrollmentStatus) => {
  const navigate = useNavigate();

  // Sample content for description for enrolled students
  const sampleEnrolledDescription = {
    programName: "Senior High School - STEM",
    year: 11,
    paymentStatus: "Payment Complete"
  };

  const statusContent: Record<EnrollmentStatus["status"], StatusContent> = {
    Pending: {
      statusLabel: "Pending Enrollment",
      statusLabelColor: "bg-accent",
      description: "Your enrollment application is currently being processed. Please check back later for updates.",
      actionText: "Check required documents",
      action: () => navigate("/"),
    },
    None: {
      statusLabel: "No application submitted",
      statusLabelColor: "bg-border-1",
      actionText: "Click here to apply",
      action: () => navigate("/student/enroll")
    },
    Enrolled: {
      statusLabel: "Enrolled",
      statusLabelColor: "bg-success",
      description: sampleEnrolledDescription
    }
  }

  const currentStatus = statusContent[status];

  return (
    <div className="rounded-[10px] bg-background flex flex-col justify-center items-center mt-6 px-6 py-4">
      <div className="font-semibold text-primary text-lg">
        Enrollment Status
      </div>
      
      <div className={`${currentStatus.statusLabelColor} rounded-[10px] py-1.5 px-3.5 text-sm font-semibold mt-1.5`}>
        {currentStatus.statusLabel}
      </div>

      {currentStatus.description && (
        typeof currentStatus.description === "string" 
          ? (
              <p className="text-sm text-primary mt-6">{currentStatus.description}</p>
          )
          : (
            <div className="flex flex-col text-primary text-sm self-start mt-6">
              <div>
                <span className="font-semibold">Program: </span>
                {sampleEnrolledDescription.programName}
              </div>
              <div>
                <span className="font-semibold">Year: </span>
                {sampleEnrolledDescription.year}
              </div>
              <div>
                <span className="font-semibold">{typeof sampleEnrolledDescription.paymentStatus === "string" ? "Payment Status: " : "Payment Due Date: "}</span>
                {sampleEnrolledDescription.paymentStatus}
              </div>
            </div>
          )
      )}

      {currentStatus.actionText && (
        <div
          className="text-sm font-semibold text-primary underline self-start mt-6 cursor-pointer"
          onClick={currentStatus.action}
        >
          {currentStatus.actionText}
        </div>
      )}
    </div>
  )
}

export default StatusBox
