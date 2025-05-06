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
//import { GradeLevelsWithSections } from "./fees.types";


export default function Fees() {
  const data = [];
  const [selectedGradeLevels, setSelectedGradeLevels] = useState<any[] | null>(null);

  return (
    <section className="flex flex-row justify-center items-center gap-x-5 py-14">
      {/* Grades and Sections */}
      <div className="bg-background rounded-[10px] h-[65vh] w-[25%] py-[30px] px-7 shadow-[0px_1px_10px_1px_rgba(0,0,0,0.10)]">
        <div className="h-full overflow-y-auto">
          <div className="font-semibold text-text-2 text-base mb-4">Select a grade level to apply the fees to</div>
          <Accordion 
            type="single" 
            className="mr-6"
            collapsible>
            {data.map((item) => (
              <AccordionItem 
                value={`item-${item.id}`}
                className={`
                  ${item.id === data.length ? "rounded-b-[10px]" : "" }
                  ${item.id === 1 ? "rounded-t-[10px]" : ""}
                  px-6 border-text-2 border
                `}
              >
                <div className="flex flex-row items-center">
                  <FontAwesomeIcon icon={faCheckSquare} className="mr-4" style={{ fontSize: 16 }}/>
                  <AccordionTrigger className="text-text-2 text-sm">Grade {item.gradeLevel}</AccordionTrigger>
                </div>
                {item.sections.map((section) => (
                  <AccordionContent key={section.id} className="ml-8 text-text-2">
                    {section.name}
                  </AccordionContent>
                ))}
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Fee Details */}
      <div className="flex flex-col gap-y-9 justify-between items-center w-[40%]">
        <div className="bg-background rounded-[10px] h-[54vh] w-full py-[30px] px-7 shadow-[0px_1px_10px_1px_rgba(0,0,0,0.10)]">
          <div className="h-full overflow-y-auto">
            {!selectedGradeLevels 
              ? <div className="flex justify-center h-full items-center text-text-2">Please select a grade level to proceed</div> 
              : (
                "Sup"
              )
            }
          </div>
        </div>

        <Button
          className="w-fit"
          disabled={!selectedGradeLevels}
        >
          Save changes
        </Button>
      </div>
    </section>
  )
}
