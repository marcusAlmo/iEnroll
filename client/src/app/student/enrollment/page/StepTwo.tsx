import { faFaceSmileWink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import UploadBox from "../components/UploadBox";
import { stepTwoSchema } from "../schema/StepTwoSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomInput from "@/components/CustomInput";
import FeeBreakdown from "../components/FeeBreakdown";
import CustomDropdown from "@/components/CustomDropdown";
import { modalContent } from "./modalContent";

// Sample data
import requirements from "@/test/data/requirements.json";
import fees from "@/test/data/fees.json";
import paymentMethods from "@/test/data/payment-methods.json";

const StepTwo = () => {
  const [isUploaded, setIsUploaded] = useState<boolean>(false);

  // Show modals
  const [showModals, setShowModals] = useState({
    helpModal: false,
    submitModal: false,
    saveDraftModal: false
  });

  // Calculate fees
  const calculateTotalFees = () => {
    return fees.reduce((total, fee) => total + fee.feeBreakdown.reduce((subTotal, breakdown) => subTotal + breakdown.feeAmount, 0), 0);
  };

  const form = useForm<z.infer<typeof stepTwoSchema>>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      fatherFN: "",
      fatherMN: "",
      fatherLN: "",
      maidenMotherFN: "",
      maidenMotherMN: "",
      maidenMotherLN: "",
      paymentMethodName: "",
      isAgree: undefined
    },
  });

  const onSubmit = (data: z.infer<typeof stepTwoSchema>) => {
    console.log(data);
  };

  // For watching if the selected payment method name changed
  const selectedPaymentMethod = form.watch("paymentMethodName");

  // For dynamically displaying account number and name upon selecting a method
  const selectedPaymentDetails = paymentMethods.find(
    (method) => method.id === parseInt(selectedPaymentMethod)
  );

  return (
    <section className="w-screen flex flex-col items-center justify-center p-12 bg-container-1">
      <div className="text-center space-y-1.5">
        <h1 className="text-accent font-semibold text-3xl">
          {isUploaded ? "Nice, uploaded na!" : "Uy, requirements!"}
        </h1>
        <p className="text-text-2 text-sm font-semibold">Please submit the needed requirements</p>
      </div>

      <div 
        className="rounded-[10px] bg-accent py-0.5 px-2.5 space-x-1 mt-6"
        // onClick={() => setShowModals(true)}
      >
        <span className="text-sm font-semibold">Need help? Tap me!</span>
        <FontAwesomeIcon icon={faFaceSmileWink} className="text-primary" />
      </div>

      <div className="mt-8 w-screen px-14">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex flex-col gap-y-5 mb-10">
              <span className="text-primary font-semibold text-base">Father's Details</span>
                <CustomInput
                  control={form.control}
                  name="fatherFN"
                  label="Father's First Name"
                  placeholder="ex. Juan"
                  inputStyle="rounded-[10px] bg-background border border-border-1 text-sm py-3 px-4 text-text placeholder:text-text-2"
                  labelStyle="text-sm text-text-2"
                />

                <CustomInput
                  control={form.control}
                  name="fatherMN"
                  label="Father's Middle Name (optional)"
                  placeholder="ex. Santos"
                  inputStyle="rounded-[10px] bg-background border border-border-1 text-sm py-3 px-4 text-text placeholder:text-text-2"
                  labelStyle="text-sm text-text-2"
                />

                <CustomInput
                  control={form.control}
                  name="fatherLN"
                  label="Father's Last Name"
                  placeholder="ex. Dela Cruz"
                  inputStyle="rounded-[10px] bg-background border border-border-1 text-sm py-3 px-4 text-text placeholder:text-text-2"
                  labelStyle="text-sm text-text-2"
                />
            </div>

            <div className="flex flex-col gap-y-5 mb-10">
              <span className="text-primary font-semibold text-base">Mother's Details</span>
                <CustomInput
                  control={form.control}
                  name="maidenMotherFN"
                  label="Mother's First Name"
                  placeholder="ex. Jane"
                  inputStyle="rounded-[10px] bg-background border border-border-1 text-sm py-3 px-4 text-text placeholder:text-text-2"
                  labelStyle="text-sm text-text-2"
                />

                <CustomInput
                  control={form.control}
                  name="maidenMotherMN"
                  label="Mother's Maiden Middle Name (optional)"
                  placeholder="ex. Dimaano"
                  inputStyle="rounded-[10px] bg-background border border-border-1 text-sm py-3 px-4 text-text placeholder:text-text-2"
                  labelStyle="text-sm text-text-2"
                />

                <CustomInput
                  control={form.control}
                  name="maidenMotherLN"
                  label="Mother's Maiden Last Name"
                  placeholder="ex. Sanchez"
                  inputStyle="rounded-[10px] bg-background border border-border-1 text-sm py-3 px-4 text-text placeholder:text-text-2"
                  labelStyle="text-sm text-text-2"
                />
            </div>

            <div className="w-full">
              <div className="text-primary font-semibold text-base mb-4">Requirements</div>
              {requirements.map((requirement, index) => (
                <div key={index} className="mb-6">
                  <UploadBox label={requirement.name} />
                </div>
              ))}
            </div>

            <div className="w-full">
              <div className="text-primary font-semibold text-base mb-4">Fees</div>
              {fees.map((fee, index) => (
                <div key={index} className="mb-6">
                  <FeeBreakdown feeType={fee.feeType} feeBreakdown={fee.feeBreakdown} feeDetails={fee.feeDetails} />
                </div>
              ))}
              <div className="rounded-[10px] py-3 px-4 bg-danger/15 flex flex-row justify-between">
                <span className="font-semibold text-danger text-sm">TOTAL AMOUNT</span>
                <span className="font-semibold text-danger text-sm">PHP {calculateTotalFees()}</span>
              </div>
            </div>

            <div className="flex flex-col gap-y-2">
              <div className="text-text-2 text-sm text-center">You can securely pay by selecting any of the payment options below.</div>
                <CustomDropdown
                  control={form.control}
                  name="paymentMethodName"
                  values={paymentMethods.map((method) => ({
                    label: method.methodName,
                    ...method,
                  }))}
                  buttonClassName="w-full rounded-[10px] bg-background px-4 py-2 text-sm transition-all ease-in-out hover:text-secondary"
                  menuClassName="w-full rounded-[10px] bg-white"
                  itemClassName="rounded-[10px] transition-all ease-in-out"
                  label=""
                  labelClassName="text-sm text-text-2"
                  placeholder="Select payment method"
                />
                {selectedPaymentMethod && (
                  <>
                    <div className="bg-accent/20 rounded-[10px] py-2 w-full flex justify-center">
                      <div className="text-primary font-semibold text-sm">
                        Account Number: {selectedPaymentDetails?.accountNumber || "No account number available"}
                      </div>
                    </div>
                    
                    <div className="bg-accent/20 rounded-[10px] py-2 w-full flex justify-center">
                      <div className="text-primary font-semibold text-sm">
                        Account Name: {selectedPaymentDetails?.ownerName || "No account name available"}
                      </div>
                    </div>
                  </>
                )}
            </div>

            <div className="w-full">
              <div className="text-primary font-semibold text-sm mb-4">Please upload proof of your payment</div>
              <UploadBox label="" />
            </div>

            <div className="flex flex-col gap-y-2">
              <div className="flex items-start gap-x-2 mt-4 bg-background rounded-[10px] px-6 py-4">
                <input
                  type="checkbox"
                  id="isAgree"
                  {...form.register("isAgree")}
                  className="w-4 h-4 text-secondary bg-gray-100 border-gray-300 rounded focus:ring-secondary focus:ring-2 checked:bg-secondary"
                />
                <label htmlFor="isAgree" className="text-sm text-primary">
                  I agree that the school may use and store the uploaded documents for the purpose of processing my enrollment, in accordance with the school's privacy policy.
                </label>
              </div>
              <span className="text-danger text-sm">{form.formState.errors.isAgree && "Please agree to the terms and conditions"}</span>
            </div>

            <div className="flex flex-col gap-y-2 items-center">
              <button
                type="submit"
                className="w-full font-semibold bg-accent text-background py-3 rounded-[10px]"
              >
                Submit Requirements
              </button>
              
              {/* Only display when the form is partially filled */}
              {form.formState.isDirty && (
                <>
                  <span className="text-sm text-text-2">or</span>
                  <button
                    // onclick
                    className="w-full font-semibold bg-success/10 border border-success rounded-[10px] py-3 text-success text-sm"
                  >
                    Save as Draft
                  </button>
                </>
              )}
            </div>
          </form>
        </Form>
      </div>
    </section>
  )
}

export default StepTwo
