import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestData } from "@/lib/dataRequester";
import { faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

interface FeeItem {
  feeId: number;
  feeTypeId: number;
  feeName: string;
  amount: number;
  description: string | null;
  dueDate: Date;
}

interface FeeType {
  feeType: string;
  feeTypeId: number;
}

const FeesInput = ({ 
  onFeeDataChange,
  initialFees = [],
  feeTypes = [],
  retrieveFees,
}: { 
  onFeeDataChange: (data: FeeItem[]) => void;
  initialFees?: FeeItem[];
  feeTypes?: FeeType[];
  retrieveFees: () => void;
}) => {
  const [fees, setFees] = useState<FeeItem[]>(initialFees);
  const lastInitialFeesRef = useRef<FeeItem[]>(initialFees);

  // Only update state if initialFees actually changed
  useEffect(() => {
    if (JSON.stringify(lastInitialFeesRef.current) !== JSON.stringify(initialFees)) {
      setFees(initialFees);
      lastInitialFeesRef.current = initialFees;
    }
  }, [initialFees]);

  // Debounce the parent updates
  useEffect(() => {
    const timer = setTimeout(() => {
      if (JSON.stringify(fees) !== JSON.stringify(lastInitialFeesRef.current)) {
        onFeeDataChange(fees);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [fees, onFeeDataChange]);

  // Add this right after your debounce useEffect
  useEffect(() => {
    console.log("Current fees in FeesInput:", fees.map(fee => ({
      id: fee.feeId,
      typeId: fee.feeTypeId,
      name: fee.feeName,
      amount: fee.amount,
      description: fee.description,
      dueDate: fee.dueDate
    }))); 
  }, [fees]);

  const handleAddFee = () => {
    if (feeTypes.length === 0) {
      toast.error("No fee types available");
      return;
    }
    
    const newFee: FeeItem = {
      feeId: 0, // Changed from Date.now() to 0 for new records
      feeTypeId: feeTypes[0].feeTypeId,
      feeName: `New ${feeTypes[0].feeType}`,
      amount: 0,
      description: null,
      dueDate: new Date()
    };
    setFees(prev => [...prev, newFee]);
  };

  const handleRemoveFee = async (feeId: number) => {
    try {
      const response = await requestData<{message: string}>({
        url: `http://localhost:3000/api/fees/delete/${feeId}`,
        method: "DELETE",
      });

      if (response) {
        toast.success(response.message);
        retrieveFees();
        setFees(prev => prev.filter(fee => fee.feeId !== feeId));
      }
    } catch(err) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("An error occurred while removing fee.");

      console.error(err); 
    }
  };

  const handleFeeChange = (feeId: number, field: keyof FeeItem, value: any) => {
    setFees(prev =>
      prev.map(fee =>
        fee.feeId === feeId ? { ...fee, [field]: value } : fee
      )
    );
  };


  return (
    <div className="w-full flex flex-col gap-y-6 pr-4">
      {fees.map((fee) => {
        const currentFeeType = feeTypes.find(type => type.feeTypeId === fee.feeTypeId);
        
        return (
          <div key={fee.feeId} className="space-y-4">
            <div className="flex flex-row gap-x-5 items-start">
              <div className="flex-1 flex flex-col gap-y-1">
                <label className="text-text font-semibold text-sm">Fee Type</label>
                <select
                  value={fee.feeTypeId || feeTypes[0]?.feeTypeId || ''}
                  onChange={(e) => {
                    const newTypeId = Number(e.target.value);
                    handleFeeChange(fee.feeId, 'feeTypeId', newTypeId);
                  }}
                  className="border border-text-2 rounded-md p-2 text-sm w-full"
                >
                  {feeTypes.map((type) => (
                    <option key={type.feeTypeId} value={type.feeTypeId}>
                      {type.feeType}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 flex flex-col gap-y-1">
                <label className="text-text font-semibold text-sm">Fee Name</label>
                <Input
                  placeholder="ex. Tuition Fee"
                  className="border border-text-2"
                  value={fee.feeName}
                  onChange={(e) =>
                    handleFeeChange(fee.feeId, 'feeName', e.target.value)
                  }
                />
              </div>

              <div className="pt-7">
                <button
                  onClick={() => handleRemoveFee(fee.feeId)}
                  className="text-danger hover:text-danger-dark flex items-center gap-1"
                  title="Remove fee"
                >
                  <FontAwesomeIcon icon={faTrash} size="sm" />
                </button>
              </div>
            </div>

            <div className="flex flex-row gap-x-5">
              <div className="flex-1">
                <label className="text-text font-semibold text-sm">
                  Description (optional)
                </label>
                <Input
                  placeholder="ex. Annual tuition fee"
                  className="border border-text-2 w-full"
                  value={fee.description || ''}
                  onChange={(e) =>
                    handleFeeChange(fee.feeId, 'description', e.target.value)
                  }
                />
              </div>
              <div className="w-32">
                <label className="text-text font-semibold text-sm">
                  Amount
                </label>
                <Input
                  placeholder="ex. 500"
                  className="border border-text-2"
                  type="number"
                  required
                  value={fee.amount}
                  onChange={(e) =>
                    handleFeeChange(fee.feeId, 'amount', Number(e.target.value))
                  }
                />
              </div>
            </div>

            <hr className="border border-gray-300 my-4" />
          </div>
        );
      })}

      <Button
        onClick={handleAddFee}
        className="my-4 bg-background rounded-[10px] border border-text-2 text-text-2 hover:bg-slate-200"
      >
        <FontAwesomeIcon
          icon={faPlusCircle}
          className="text-accent"
          style={{ fontSize: 16 }}
        />
        Add another fee
      </Button>
    </div>
  );
};

export default FeesInput;