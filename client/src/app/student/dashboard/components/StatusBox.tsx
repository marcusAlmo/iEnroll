import { useNavigate } from "react-router";
import { EnrollmentStatus, StatusContent } from "../dashboard.types";

const StatusBox = ({ status, description }: EnrollmentStatus) => {
  const navigate = useNavigate();

  const statusContent: Record<EnrollmentStatus["status"], StatusContent> = {
    Pending: {
      statusLabel: "Pending Enrollment",
      statusLabelColor: "bg-accent",
      description:
        "Your enrollment application is currently being processed. Please check back later for updates.",
      actionText: "Check required documents",
      action: () => navigate("/"),
    },
    None: {
      statusLabel: "No application submitted",
      statusLabelColor: "bg-border-1",
      actionText: "Click here to apply",
      action: () => navigate("/student/enroll/step-1"),
    },
    Enrolled: {
      statusLabel: "Enrolled",
      statusLabelColor: "bg-success",
      description: description,
    },
    Denied: {
      statusLabel: "Denied",
      statusLabelColor: "bg-red-500 text-white",
      description: "Unfortunately, you cannot enroll due to invalid documents.",
    },
    Invalid: {
      statusLabel: "Invalid",
      statusLabelColor: "bg-warning",
      description: "Your enrollment is denied due to invalid documents.",
    },
  };

  const currentStatus = statusContent[status];

  return (
    <div className="bg-background mt-6 flex flex-col items-center justify-center rounded-[10px] px-6 py-4">
      <div className="text-primary text-lg font-semibold">
        Enrollment Status
      </div>

      <div
        className={`${currentStatus.statusLabelColor} mt-1.5 rounded-[10px] px-3.5 py-1.5 text-sm font-semibold`}
      >
        {currentStatus.statusLabel}
      </div>

      {currentStatus.description &&
        (typeof currentStatus.description === "string" ? (
          <p className="text-primary mt-6 text-sm">
            {currentStatus.description}
          </p>
        ) : (
          <div className="text-primary mt-6 flex flex-col self-start text-sm">
            <div>
              <span className="font-semibold">Program: </span>
              {description?.programName}
            </div>
            <div>
              <span className="font-semibold">Year: </span>
              {description?.year}
            </div>
            <div>
              <span className="font-semibold">Section: </span>
              {description?.section}
            </div>
            <div>
              <span className="font-semibold">
                {typeof description?.paymentStatus === "string"
                  ? "Payment Status: "
                  : "Payment Due Date: "}
              </span>
              {typeof description?.paymentStatus === "string"
                ? description.paymentStatus
                : description?.paymentStatus?.toLocaleDateString()}
            </div>
          </div>
        ))}

      {/* I removed this, I cannot vision what will be the purpose of this */}
      {/* {currentStatus.actionText && (
        <div
          className="text-primary mt-6 cursor-pointer self-start text-sm font-semibold underline"
          onClick={currentStatus.action}
        >
          {currentStatus.actionText}
        </div>
      )} */}
    </div>
  );
};

export default StatusBox;
