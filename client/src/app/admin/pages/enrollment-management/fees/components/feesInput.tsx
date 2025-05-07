import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { faPlus, faPlusCircle, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

const FeesInput = ({ onFeeDataChange }: { onFeeDataChange: (data: any) => void }) => {
  const [feeTypes, setFeeTypes] = useState<
    { feeType: string; feeBreakdown: { description: string; amount: string }[] }[]
  >([
    { feeType: "", feeBreakdown: [{ description: "", amount: "" }] },
  ]);

  useEffect(() => {
    onFeeDataChange(feeTypes); // Update parent component whenever feeTypes changes
  }, [feeTypes, onFeeDataChange]);

  const handleAddFeeType = () => {
    setFeeTypes((prev) => [
      ...prev,
      { feeType: "", feeBreakdown: [{ description: "", amount: "" }] },
    ]);
  };

  const handleRemoveFeeType = (index: number) => {
    setFeeTypes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddFeeBreakdown = (index: number) => {
    setFeeTypes((prev) =>
      prev.map((feeType, i) =>
        i === index
          ? {
              ...feeType,
              feeBreakdown: [
                ...feeType.feeBreakdown,
                { description: "", amount: "" },
              ],
            }
          : feeType
      )
    );
  };

  const handleRemoveFeeBreakdown = (feeTypeIndex: number, breakdownIndex: number) => {
    setFeeTypes((prev) =>
      prev.map((feeType, i) =>
        i === feeTypeIndex
          ? {
              ...feeType,
              feeBreakdown: feeType.feeBreakdown.filter(
                (_, bIndex) => bIndex !== breakdownIndex
              ),
            }
          : feeType
      )
    );
  };

  return (
    <div className="w-full flex flex-col gap-y-3 pr-4">
      {feeTypes.map((feeType, feeTypeIndex) => (
        <div key={feeTypeIndex}>
          <div className="flex flex-row gap-x-5">
            <div className="flex flex-col gap-y-1">
              <label className="text-text font-semibold text-sm">
                Fee Type (optional)
              </label>
              <Input
                placeholder="ex. Miscellaneous Fees"
                className="border border-text-2 w-[300px]"
                value={feeType.feeType}
                onChange={(e) =>
                  setFeeTypes((prev) =>
                    prev.map((ft, i) =>
                      i === feeTypeIndex ? { ...ft, feeType: e.target.value } : ft
                    )
                  )
                }
              />
            </div>
            <div className="flex">
              <div
                className="rounded-[10px] border border-text-2 px-3 py-1.5 mt-5 hover:bg-slate-300"
                onClick={() =>
                  handleRemoveFeeType(feeTypeIndex)
                }
                title="Remove fee type"
              >
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-danger hover:cursor-pointer"
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-y-5 mt-3">
            {feeType.feeBreakdown.map((breakdown, breakdownIndex) => (
              <div key={breakdownIndex} className="flex flex-row gap-x-5">
                <div>
                  <label className="text-text font-semibold text-sm">
                    Fee Breakdown
                  </label>
                  <Input
                    min={0}
                    required
                    placeholder="ex. Miscellaneous Fees"
                    className="border border-text-2 w-full"
                    value={breakdown.description}
                    onChange={(e) =>
                      setFeeTypes((prev) =>
                        prev.map((ft, i) =>
                          i === feeTypeIndex
                            ? {
                                ...ft,
                                feeBreakdown: ft.feeBreakdown.map((bd, bIndex) =>
                                  bIndex === breakdownIndex
                                    ? { ...bd, description: e.target.value }
                                    : bd
                                ),
                              }
                            : ft
                        )
                      )
                    }
                  />
                </div>
                <div className="flex flex-row items-center gap-x-5">
                  <div className="w-fit">
                    <label className="text-text font-semibold text-sm">
                      Amount
                    </label>
                    <Input
                      placeholder="ex. 500"
                      className="border border-text-2"
                      type="number"
                      required
                      value={breakdown.amount}
                      onChange={(e) =>
                        setFeeTypes((prev) =>
                          prev.map((ft, i) =>
                            i === feeTypeIndex
                              ? {
                                  ...ft,
                                  feeBreakdown: ft.feeBreakdown.map(
                                    (bd, bIndex) =>
                                      bIndex === breakdownIndex
                                        ? { ...bd, amount: e.target.value }
                                        : bd
                                  ),
                                }
                              : ft
                          )
                        )
                      }
                    />
                  </div>
                  <div
                    className="rounded-[10px] border border-text-2 px-3 py-1.5 mt-5 hover:bg-slate-300"
                    onClick={() =>
                      handleRemoveFeeBreakdown(feeTypeIndex, breakdownIndex)
                    }
                    title="Remove fee breakdown"
                  >
                    <FontAwesomeIcon
                      icon={faTrash}
                      className="text-danger hover:cursor-pointer"
                    />
                  </div>
                  <div
                    onClick={() => handleAddFeeBreakdown(feeTypeIndex)}
                    className="rounded-[10px] border border-text-2 px-3 py-1.5 mt-5 hover:bg-slate-300"
                    title="Add fee breakdown"
                  >
                    <FontAwesomeIcon
                      icon={faPlus}
                      className="text-success hover:cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            ))}
            <hr className="border border-gray-300 my-6" />
          </div>
        </div>
      ))}

      <Button
        onClick={handleAddFeeType}
        className="my-4 bg-background rounded-[10px] border border-text-2 text-text-2 hover:bg-slate-200"
      >
        <FontAwesomeIcon
          icon={faPlusCircle}
          className="text-accent"
          style={{ fontSize: 16 }}
        />
        Add another fee type
      </Button>
    </div>
  );
};

export default FeesInput;