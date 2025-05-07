/**
 * The `Fees` component is responsible for managing the selection of grade levels and sections
 * to apply fees, as well as handling the input and submission of fee details. It provides a 
 * user interface for selecting grade levels and their respective sections, entering fee data, 
 * and saving the changes.
 *
 * @component
 *
 * @returns {JSX.Element} The rendered `Fees` component.
 *
 * @remarks
 * - This component uses the `Accordion` component to display grade levels and their sections.
 * - The `FeesInput` component is used to handle fee data input.
 * - A `CustomAlertDialog` is used to confirm saving changes.
 *
 * @example
 * ```tsx
 * import Fees from './Fees';
 *
 * function App() {
 *   return <Fees />;
 * }
 * ```
 *
 * @state {GradeLevelsWithSections[] | null} selectedGradeLevels - The currently selected grade levels.
 * @state {{ gradeLevelId: number; sections: number[] }[]} selectedSections - The selected sections grouped by grade level.
 * @state {any} feeData - The fee data entered by the user.
 * @state {boolean} showModal - Controls the visibility of the confirmation modal.
 *
 * @function handleSelectGradeLevel
 * Handles the selection and deselection of a grade level.
 * @param {GradeLevelsWithSections} item - The grade level to select or deselect.
 *
 * @function handleSelectSection
 * Handles the selection and deselection of a section within a grade level.
 * @param {number} gradeLevelId - The ID of the grade level.
 * @param {number} sectionId - The ID of the section to select or deselect.
 *
 * @function isGradeLevelSelected
 * Checks if a grade level has any sections selected.
 * @param {number} gradeLevelId - The ID of the grade level to check.
 * @returns {boolean} `true` if the grade level has selected sections, otherwise `false`.
 *
 * @dependencies
 * - `Accordion`, `AccordionContent`, `AccordionItem`, `AccordionTrigger` from `@/components/ui/accordion`
 * - `FontAwesomeIcon` from `@fortawesome/react-fontawesome`
 * - `Button` from `@/components/ui/button`
 * - `FeesInput` from `./components/feesInput`
 * - `CustomAlertDialog` from `@/components/CustomAlertDialog`
 *
 * @data
 * - Sample data is imported from `./test/grade-level-with-sections.json`.
 */

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { GradeLevelsWithSections } from "./fees.types";

// Sample data
import data from "./test/grade-level-with-sections.json";
import FeesInput from "./components/feesInput";
import CustomAlertDialog from "@/components/CustomAlertDialog";

export default function Fees() {
  const [selectedGradeLevels, setSelectedGradeLevels] = useState<GradeLevelsWithSections[] | null>(null);
  const [selectedSections, setSelectedSections] = useState<{ gradeLevelId: number; sections: number[] }[]>([]);
  const [feeData, setFeeData] = useState<any>([]);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleSelectGradeLevel = (item: GradeLevelsWithSections) => {
    setSelectedGradeLevels((prev) => {
      if (!prev) {
        return [item];
      }

      const isAlreadySelected = prev.some((gradeLevel) => gradeLevel.id === item.id);

      if (isAlreadySelected) {
        return prev.filter((gradeLevel) => gradeLevel.id !== item.id);
      } else {
        return [...prev, item];
      }
    });
  };

  const handleSelectSection = (gradeLevelId: number, sectionId: number) => {
    setSelectedSections((prev) => {
      const gradeLevel = prev.find((item) => item.gradeLevelId === gradeLevelId);

      if (gradeLevel) {
        const isSectionSelected = gradeLevel.sections.includes(sectionId);

        if (isSectionSelected) {
          // Deselect the section
          const updatedSections = prev.map((item) =>
            item.gradeLevelId === gradeLevelId
              ? { ...item, sections: item.sections.filter((id) => id !== sectionId) }
              : item
          );

          // Remove the grade level if no sections are selected
          return updatedSections.filter((item) => item.sections.length > 0);
        } else {
          // Select the section
          return prev.map((item) =>
            item.gradeLevelId === gradeLevelId
              ? { ...item, sections: [...item.sections, sectionId] }
              : item
          );
        }
      } else {
        // Add a new grade level with the selected section
        return [...prev, { gradeLevelId, sections: [sectionId] }];
      }
    });
  };

  const isGradeLevelSelected = (gradeLevelId: number) => {
    return selectedSections.some((item) => item.gradeLevelId === gradeLevelId);
  };

  return (
    <section className="flex flex-row justify-center items-center gap-x-5 py-14">
      {/* Grades and Sections */}
      <div className="bg-background rounded-[10px] h-[65vh] w-[25%] py-[30px] px-7 shadow-[0px_1px_10px_1px_rgba(0,0,0,0.10)]">
        <div className="h-full overflow-y-auto">
          <div className="font-semibold text-text-2 text-base mb-4">Select sections to apply the fees to</div>
          <Accordion type="single" className="mr-6" collapsible>
            {data.map((item) => (
              <AccordionItem
                key={item.id}
                value={`item-${item.id}`}
                className={`
                  ${item.id === data.length ? "rounded-b-[10px]" : ""}
                  ${item.id === 1 ? "rounded-t-[10px]" : ""}
                  px-6 border-text-2 border
                `}
              >
                <div className="flex flex-row items-center">
                  <FontAwesomeIcon
                    icon={faCheckSquare}
                    className={`mr-4 cursor-pointer ${
                      isGradeLevelSelected(item.id) ? "text-accent" : "text-text-2/60"
                    }`}
                    style={{ fontSize: 16 }}
                    onClick={() => handleSelectGradeLevel(item)}
                  />
                  <AccordionTrigger
                    className={`text-sm ${
                      isGradeLevelSelected(item.id) ? "text-text" : "text-text-2"
                    }`}
                  >
                    Grade {item.gradeLevel}
                  </AccordionTrigger>
                </div>
                {item.sections.map((section) => {
                  const isSelected = selectedSections.some(
                    (gradeLevel) =>
                      gradeLevel.gradeLevelId === item.id && gradeLevel.sections.includes(section.id)
                  );

                  return (
                    <AccordionContent key={section.id} className="ml-8 text-text-2">
                      <div
                        className={`flex flex-row gap-x-5 items-center cursor-pointer ${
                          isSelected ? "text-accent font-semibold" : ""
                        }`}
                        onClick={() => handleSelectSection(item.id, section.id)}
                      >
                        <FontAwesomeIcon
                          icon={faCheckSquare}
                          className={isSelected ? "text-accent" : "text-text-2/60"}
                        />
                        <span>{section.name}</span>
                      </div>
                    </AccordionContent>
                  );
                })}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Fee Details */}
      <div className="flex flex-col gap-y-9 justify-between items-center w-[40%]">
        <div className="bg-background rounded-[10px] h-[54vh] w-full py-[30px] px-7 shadow-[0px_1px_10px_1px_rgba(0,0,0,0.10)]">
          <div className="h-full overflow-y-auto">
            {!selectedGradeLevels ? (
              <div className="flex justify-center h-full items-center text-text-2">
                Please select a grade level to proceed
              </div>
            ) : (
              <FeesInput onFeeDataChange={setFeeData} />
            )}
          </div>
        </div>

        <Button
          className="w-fit bg-accent font-semibold hover:cursor-pointer"
          disabled={!selectedGradeLevels}
          onClick={() => setShowModal(true)}
        >
          Save changes
        </Button>
      </div>

      <CustomAlertDialog
        isOpen={showModal}
        title="Save changes?"
        description="Please verify the fee details before submitting."
        cancelLabel="Cancel"
        cancelOnClick={() => setShowModal(false)}
        actionLabel="Submit"
        actionOnClick={() => console.log("Selected Sections:", selectedSections)}
      />
    </section>
  );
}