import React from "react";
import { useEnrollmentReview } from "../../../../context/enrollmentReviewContext";

/**
 * RequirementsPanel Component
 *
 * Displays the list of requirements for a selected student with status and action options.
 */
export const RequirementsPanel: React.FC = () => {
  const {
    setCurrentIndex,
    // selectedStudent,
    requirements,
    setSelectedRequirement,
    setIsModalOpen,
    isStudentRequirementPending,
  } = useEnrollmentReview();

  return (
    <div className="border-text-2 bg-background h-[530px] w-[460px] overflow-y-scroll rounded-[10px] rounded-l border p-2 shadow-md">
      <table className="w-full table-auto border-collapse">
        <thead className="text-text-2 text-left">
          <tr>
            <th>REQUIREMENTS</th>
            <th>STATUS</th>
            <th>ACTION</th>
          </tr>
        </thead>

        <tbody className="w-full text-left text-sm">
          {
            // selectedStudent ? (

            isStudentRequirementPending ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-text-2 py-10 text-center text-sm"
                >
                  Loading requirements...
                </td>
              </tr>
            ) : requirements?.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="text-text-2 py-10 text-center text-sm"
                >
                  No requirements available.
                </td>
              </tr>
            ) : (
              requirements?.map((requirement, index) => (
                <tr key={index} className="hover:bg-accent/50">
                  <td className="w-2/4 border-b p-1">
                    {requirement.requirementName}
                  </td>
                  <td className="w-1/4 border-b py-1">
                    <span className="cursor-pointer items-center justify-center rounded text-start align-middle font-semibold transition-all duration-300 ease-in-out">
                      {requirement.requirementStatus === 'accepted' ? (
                        <p className="bg-success/20 my-2 mr-2 rounded-full border border-green-700 py-1 text-center text-xs text-green-700">
                          Approved
                        </p>
                      ) : requirement.requirementStatus === 'invalid' ? (
                        <p className="bg-danger/20 my-2 mr-2 rounded-full border border-red-700 py-1 text-center text-xs text-red-700">
                          Denied
                        </p>
                      ) : (
                        <p className="bg-warning/20 my-2 mr-2 rounded-full border border-yellow-900 py-1 text-center text-xs text-yellow-900">
                          For Review
                        </p>
                      )}
                    </span>
                  </td>
                  <td className="w-1/4 border-b p-1">
                    {(requirement.imageUrl || requirement.userInput) && (
                      <button
                        className="text-accent hover:text-primary ml-3 cursor-pointer font-semibold underline transition-all duration-300 ease-in-out hover:scale-110"
                        onClick={() => {
                          const index = requirements.findIndex(
                            (req) =>
                              req.requirementName ===
                              requirement.requirementName,
                          );
                          setCurrentIndex(index);
                          setSelectedRequirement(requirement);
                          setIsModalOpen(true);
                        }}
                      >
                        view
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )
            // ) : (
            //   <tr>
            //     <td colSpan={3} className="text-text-2 py-10 text-center text-sm">
            //       Select a student to view requirements.
            //     </td>
            //   </tr>
            // )
          }
        </tbody>
      </table>
    </div>
  );
};
