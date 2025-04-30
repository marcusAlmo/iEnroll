import { feeTypes } from "../enrollment.types"

const FeeBreakdown = ({
  feeType,
  feeBreakdown,
  feeDetails
}: feeTypes) => {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="text-primary text-sm font-semibold">{feeType}</div>
      <p className="text-sm text-text-2 italic">{feeDetails}</p>
      <div className="bg-background border border-border-1 px-4 py-3 rounded-[10px]">
        {feeBreakdown.map((breakdown, index) => (
          <div key={index} className="grid grid-cols-3">
            <div className="text-text-2 font-normal text-sm col-span-2">{breakdown.feeBreakdown}</div>
            <div className="text-text-2 font-normal text-sm">{breakdown.feeAmount}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FeeBreakdown
