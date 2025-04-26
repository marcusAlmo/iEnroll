import { useNavigate } from "react-router";
import { 
  EnrollmentStatus,
  StatusContent
 } from "../dashboard.types";

const StatusBox = ({ status, description }: EnrollmentStatus) => {
  const navigate = useNavigate();

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
      action: () => navigate("/student/enroll/step-1")
    },
    Enrolled: {
      statusLabel: "Enrolled",
      statusLabelColor: "bg-success",
      description: description
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
                {description?.programName}
              </div>
              <div>
                <span className="font-semibold">Year: </span>
                {description?.year}
              </div>
              <div>
                <span className="font-semibold">{typeof description?.paymentStatus === "string" ? "Payment Status: " : "Payment Due Date: "}</span>
                {typeof description?.paymentStatus === "string" 
                  ? description.paymentStatus 
                  : description?.paymentStatus?.toLocaleDateString()}
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
