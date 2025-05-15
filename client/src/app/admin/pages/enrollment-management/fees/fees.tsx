import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useMemo, useState } from "react";
import FeesInput from "./components/feesInput";
import CustomAlertDialog from "@/components/CustomAlertDialog";
import { toast } from "react-toastify";
import { requestData } from "@/lib/dataRequester";

interface GradeLevelFeeData {
  gradeLevelCode: string;
  gradeLevel: string;
  fees: {
    feeTypeId: number;
    feeId: number;
    feeName: string;
    amount: number;
    description: string | null;
    dueDate: Date;
  }[];
}

interface SubmitableData {
  feeTypeId: number;
  feeId: number;
  feeName: string;
  amount: number;
  description: string | null;
  dueDate: Date;
};

interface FeeType {
  feeTypeId: number;
  feeType: string;
}

export default function Fees() {
  const [currentGradeLevel, setCurrentGradeLevel] = useState<GradeLevelFeeData | null>(null);
  const [modifiedFees, setModifiedFees] = useState<Record<string, GradeLevelFeeData['fees']>>({});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [gradeLevelData, setGradeLevelData] = useState<GradeLevelFeeData[]>([]);
  const [version, setVersion] = useState(0); // Add version counter
  const [feeTypes, setFeeTypes] = useState<FeeType[]>([]);

  const handleSelectGradeLevel = (gradeLevel: GradeLevelFeeData) => {
    if (!currentGradeLevel || currentGradeLevel.gradeLevelCode !== gradeLevel.gradeLevelCode) {
      setCurrentGradeLevel(gradeLevel);
      setVersion(prev => prev + 1); // Force reset when grade changes
    }
  };

  const retrieveFeeTypes = async () => {
    try {
      const response = await requestData<FeeType[]>({
        url: `http://localhost:3000/api/fees/fee-types`,
        method: "GET",
      });

      if (response) {
        setFeeTypes(response);
      }
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("An error occurred while retrieving fees.");

      console.error(err);
    }
  }

  const handleFeeDataChange = useCallback((updatedFees: GradeLevelFeeData['fees']) => {
    if (currentGradeLevel) {
      setModifiedFees(prev => ({
        ...prev,
        [currentGradeLevel.gradeLevelCode]: updatedFees
      }));
    }
  }, [currentGradeLevel]);

  const getCurrentFees = useMemo(() => {
    if (!currentGradeLevel) return [];
    return modifiedFees[currentGradeLevel.gradeLevelCode] || currentGradeLevel.fees;
  }, [currentGradeLevel, modifiedFees]);

  const retrieveFees = async () => {
    try {
      const response = await requestData<GradeLevelFeeData[]>({
        url: `http://localhost:3000/api/fees/retrieve`,
        method: "GET",
      });

      if (response) {
        setGradeLevelData(response);
      }
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("An error occurred while retrieving fees.");

      console.error(err);
    }
  }

  const handleSubmit = async () => {
    if (!currentGradeLevel) return;
    
    const currentFees = modifiedFees[currentGradeLevel.gradeLevelCode] || [];

    const invalidFees = currentFees.filter(fee => {
      // New fees (feeId=0) must have all required fields
      if (fee.feeId === 0) {
        return !fee.feeTypeId || !fee.feeName || fee.amount <= 0;
      }
      // Existing fees must maintain their feeTypeId
      return !fee.feeTypeId;
    });
  
    if (invalidFees.length > 0) {
      toast.error(`${invalidFees.length} fee(s) require attention`);
      return;
    }
  
    // Separate new vs existing fees for submission
    let newFees: SubmitableData[] | undefined = currentFees.filter(f => f.feeId === 0);
    let existingFees: SubmitableData[] | undefined = currentFees.filter(f => f.feeId !== 0);

    newFees = newFees && newFees.length > 0 ? newFees : undefined;
    existingFees = existingFees && existingFees.length > 0
      ? existingFees : undefined;

    if (newFees === undefined && existingFees === undefined) {
      toast.error("No fees to submit");
      setShowModal(false);
      return;
    }

    try {
      const response = await requestData<{ message: string }>({
        url: 'http://localhost:3000/api/fees/save',
        method: 'POST',
        body: {
          gradeLevelCode: currentGradeLevel.gradeLevelCode,
          existingFees,
          newFees
        }
      });

      if (response) {
        toast.success(response.message);
        await retrieveFees();
      }
    } catch (err) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error('An error has occured while processing the data');

      console.error(err);
    }
  
    setShowModal(false);
  };

  useEffect(() => {
    retrieveFeeTypes();
    retrieveFees();
  }, []);

  return (
    <section className="flex flex-row justify-center items-center gap-x-5 py-14">
      {/* Grades Selection */}
      <div className="bg-background rounded-[10px] h-[65vh] w-[25%] py-[30px] px-7 shadow-[0px_1px_10px_1px_rgba(0,0,0,0.10)]">
        <div className="h-full overflow-y-auto">
          <div className="font-semibold text-text-2 text-base mb-4">Select grade level to edit fees</div>
          <div className="mr-6">
            {gradeLevelData.map((item) => (
              <div
                key={item.gradeLevelCode}
                className={`
                  ${item.gradeLevelCode === gradeLevelData[gradeLevelData.length - 1].gradeLevelCode ? "rounded-b-[10px]" : ""}
                  ${item.gradeLevelCode === gradeLevelData[0].gradeLevelCode ? "rounded-t-[10px]" : ""}
                  px-6 py-3 border-text-2 border flex items-center
                  ${currentGradeLevel?.gradeLevelCode === item.gradeLevelCode ? "bg-accent/10" : ""}
                  hover:cursor-pointer hover:bg-slate-100
                `}
                onClick={() => handleSelectGradeLevel(item)}
              >
                <span className="text-sm">
                  {item.gradeLevel}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fee Details */}
      <div className="flex flex-col gap-y-9 justify-between items-center w-[40%]">
        <div className="bg-background rounded-[10px] h-[54vh] w-full py-[30px] px-7 shadow-[0px_1px_10px_1px_rgba(0,0,0,0.10)]">
          <div className="h-full overflow-y-auto">
            {!currentGradeLevel ? (
              <div className="flex justify-center h-full items-center text-text-2">
                Please select a grade level to edit fees
              </div>
            ) : (
              <>
                <FeesInput 
                  key={`${currentGradeLevel?.gradeLevelCode}-${version}`} // Combined key
                  onFeeDataChange={handleFeeDataChange} 
                  initialFees={getCurrentFees}
                  feeTypes={feeTypes}
                  retrieveFees={retrieveFees}
                />
              </>
            )}
          </div>
        </div>

        <Button
          className="w-fit bg-accent font-semibold hover:cursor-pointer"
          disabled={!currentGradeLevel}
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
        actionOnClick={handleSubmit}  // Use the new handler here
      />
    </section>
  );
}