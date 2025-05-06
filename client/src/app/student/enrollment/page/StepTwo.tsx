import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState } from "react";
import UploadBox from "../components/UploadBox";
import { Form } from "@/components/ui/form";
import CustomInput from "@/components/CustomInput";
import FeeBreakdown from "../components/FeeBreakdown";
import CustomDropdown from "@/components/CustomDropdown";
import { Button } from "@/components/ui/button";

// Sample data
// import requirements from "@/test/data/requirements.json";
// import fees from "@/test/data/fees.json";
// import paymentMethods from "@/test/data/payment-methods.json";
import { sanitizeName } from "@/utils/stringUtils";
import { useEnroll } from "../../context/enroll/hook";

const StepTwo = () => {
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isErrorUploading, setIsErrorUploading] = useState<boolean>(false);

  // Show tooltips
  const [showFatherDetailsTooltip, setShowFatherDetailsTooltip] =
    useState<boolean>(false);
  const [showMotherDetailsTooltip, setShowMotherDetailsTooltip] =
    useState<boolean>(false);
  const [showRequirementsTooltip, setShowRequirementsTooltip] =
    useState<boolean>(false);
  const [showFeesTooltip, setShowFeesTooltip] = useState<boolean>(false);
  const { form, requirements, paymentMethods, fees } = useEnroll();

  // Calculate fees
  const calculateTotalFees = () => {
    return (
      fees?.reduce(
        (total, fee) =>
          total +
          fee.feeBreakdown.reduce(
            (subTotal, breakdown) => subTotal + breakdown.feeAmount,
            0,
          ),
        0,
      ) ?? 0
    );
  };

  // // Generate dynamic schema for the requirements
  // const requirementsSchema = useMemo(
  //   () =>
  //     requirements ? generateSchemaFromRequirements(requirements) : undefined,
  //   [requirements],
  // );

  // // Generate default values for the requirementsSchema
  // const requirementsDefaultValues = useMemo(
  //   () =>
  //     requirements
  //       ? Object.fromEntries(
  //           requirements.map((req) => [sanitizeName(req.name), undefined]),
  //         )
  //       : undefined,
  //   [requirements],
  // );

  // Merge stepTwoSchema and requirementsSchema
  // const finalSchema = stepTwoSchema.merge(requirementsSchema);

  // const form = useForm<z.infer<typeof finalSchema>>({
  //   resolver: zodResolver(finalSchema),
  //   defaultValues: {
  //     fatherFN: "",
  //     fatherMN: "",
  //     fatherLN: "",
  //     maidenMotherFN: "",
  //     maidenMotherMN: "",
  //     maidenMotherLN: "",
  //     paymentMethodName: "",
  //     isAgree: undefined,
  //     paymentProof: undefined,
  //     ...requirementsDefaultValues,
  //   },
  // });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  // For watching if the selected payment method name changed
  const selectedPaymentMethod = form.watch("paymentMethodName");

  // For dynamically displaying account number and name upon selecting a method
  const selectedPaymentDetails = useMemo(
    () =>
      paymentMethods
        ? paymentMethods.find(
            (method) => method.id === parseInt(selectedPaymentMethod),
          )
        : undefined,
    [paymentMethods, selectedPaymentMethod],
  );

  return (
    <section className="bg-container-1 flex w-screen flex-col items-center justify-center p-12">
      <div className="space-y-1.5 text-center">
        <h1 className="text-accent text-3xl font-semibold">
          {isUploaded ? "Nice, uploaded na!" : "Uy, requirements!"}
        </h1>
        <p className="text-text-2 text-sm font-semibold">
          Please submit the needed requirements
        </p>
      </div>

      <div className="bg-accent mt-6 space-x-1 rounded-[10px] px-2.5 py-0.5">
        <span className="text-sm font-semibold">
          Need help? Just tap the{" "}
          <FontAwesomeIcon icon={faInfoCircle} className="text-primary" /> icon!
        </span>
      </div>

      <div className="mt-8 w-screen px-14">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="mb-10 flex flex-col gap-y-5">
              <div className="relative inline-block">
                <span className="text-primary text-base font-semibold">
                  Father's Details
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="text-text-2/40 ml-2"
                    onClick={() => setShowFatherDetailsTooltip((prev) => !prev)}
                  />
                </span>
                {showFatherDetailsTooltip && (
                  <div className="absolute top-0 left-38 z-10 w-32 rounded-[10px] bg-slate-300 p-2 text-xs">
                    Please provide the full name of the student's father. Middle
                    name is optional.
                  </div>
                )}
              </div>
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

            <div className="mb-10 flex flex-col gap-y-5">
              <div className="relative inline-block">
                <span className="text-primary text-base font-semibold">
                  Mother's Details
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="text-text-2/40 ml-2"
                    onClick={() => setShowMotherDetailsTooltip((prev) => !prev)}
                  />
                </span>
                {showMotherDetailsTooltip && (
                  <div className="absolute top-0 left-40 z-10 w-32 rounded-[10px] bg-slate-300 p-2 text-xs">
                    Please provide the full MAIDEN name of the student's mother.
                    Middle name is optional.
                  </div>
                )}
              </div>
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
              <div className="relative mb-4 inline-block">
                <span className="text-primary text-base font-semibold">
                  Requirements
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="text-text-2/40 ml-2"
                    onClick={() => setShowRequirementsTooltip((prev) => !prev)}
                  />
                </span>
                {showRequirementsTooltip && (
                  <div className="absolute top-[5%] right-[-105%] z-10 w-32 rounded-[10px] bg-slate-300 p-2 text-xs">
                    Please upload the documentary requirements for enrollment.
                    Allow necessary permissions during upload
                  </div>
                )}
              </div>
              {requirements?.map((requirement, index) => (
                <div key={index} className="mb-6">
                  <UploadBox
                    control={form.control}
                    name={sanitizeName(requirement.name)}
                    label={requirement.name}
                    requirementType={requirement.requirementType}
                  />
                  {form.formState.errors[sanitizeName(requirement.name)] && (
                    <span className="text-danger text-sm">
                      Please upload a file
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div className="w-full">
              <div className="relative mb-4 inline-block">
                <span className="text-primary text-base font-semibold">
                  Fees
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    className="text-text-2/40 ml-2"
                    onClick={() => setShowFeesTooltip((prev) => !prev)}
                  />
                </span>
                {showFeesTooltip && (
                  <div className="absolute top-0 left-18 z-10 w-32 rounded-[10px] bg-slate-300 p-2 text-xs">
                    Please upload the documentary requirements for enrollment.
                    Allow necessary permissions during upload
                  </div>
                )}
              </div>
              {fees?.map((fee, index) => (
                <div key={index} className="mb-6">
                  <FeeBreakdown
                    feeType={fee.feeType}
                    feeBreakdown={fee.feeBreakdown}
                    feeDetails={fee.feeDetails}
                  />
                </div>
              ))}
              <div className="bg-danger/15 flex flex-row justify-between rounded-[10px] px-4 py-3">
                <span className="text-danger text-sm font-semibold">
                  TOTAL AMOUNT
                </span>
                <span className="text-danger text-sm font-semibold">
                  PHP {calculateTotalFees()}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-y-2">
              <div className="text-text-2 text-center text-sm">
                You can securely pay by selecting any of the payment options
                below.
              </div>
              <CustomDropdown
                control={form.control}
                name="paymentMethodName"
                values={
                  paymentMethods?.map((method) => ({
                    label: method.methodName,
                    ...method,
                  })) ?? []
                }
                buttonClassName="rounded-[10px] bg-background px-4 py-2 text-sm transition-all ease-in-out hover:text-secondary"
                menuClassName="w-full rounded-[10px] bg-white"
                itemClassName="rounded-[10px] transition-all ease-in-out"
                label=""
                labelClassName="text-sm text-text-2"
                placeholder="Select payment method"
              />
              {selectedPaymentMethod && (
                <>
                  <div className="bg-accent/20 flex w-full justify-center rounded-[10px] py-2">
                    <div className="text-primary text-sm font-semibold">
                      Account Number:{" "}
                      {selectedPaymentDetails?.accountNumber ||
                        "No account number available"}
                    </div>
                  </div>

                  <div className="bg-accent/20 flex w-full justify-center rounded-[10px] py-2">
                    <div className="text-primary text-sm font-semibold">
                      Account Name:{" "}
                      {selectedPaymentDetails?.ownerName ||
                        "No account name available"}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="w-full">
              <div className="text-primary mb-4 text-sm font-semibold">
                Please upload proof of your payment
              </div>
              <UploadBox
                label=""
                control={form.control}
                name="paymentProof"
                requirementType=".pdf"
              />
              {/* NOTE -> if passing image, pass "image/*" */}
              {form.formState.errors.paymentProof && (
                <span className="text-danger text-sm">
                  Please upload a file
                </span>
              )}
            </div>

            <div className="flex flex-col gap-y-2">
              <div className="bg-background mt-4 flex items-start gap-x-2 rounded-[10px] px-6 py-4">
                <input
                  type="checkbox"
                  id="isAgree"
                  {...form.register("isAgree")}
                  className="text-secondary focus:ring-secondary checked:bg-secondary h-4 w-4 rounded border-gray-300 bg-gray-100 focus:ring-2"
                />
                <label htmlFor="isAgree" className="text-primary text-sm">
                  I agree that the school may use and store the uploaded
                  documents for the purpose of processing my enrollment, in
                  accordance with the school's privacy policy.
                </label>
              </div>
              <span className="text-danger text-sm">
                {form.formState.errors.isAgree &&
                  "Please agree to the terms and conditions"}
              </span>
            </div>

            <div className="flex flex-col items-center gap-y-2">
              {!isUploaded ? (
                <>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={`text-background bg-accent w-full rounded-[10px] py-6 font-semibold`}
                  >
                    {isLoading ? "Submitting" : "Submit Requirements"}
                  </Button>

                  {/* Only display when the form is partially filled */}
                  {form.formState.isDirty && (
                    <>
                      <span className="text-text-2 text-sm">or</span>
                      <Button
                        // onclick
                        className="bg-success/10 border-success text-success w-full rounded-[10px] border py-6 text-sm font-semibold"
                      >
                        Save as Draft
                      </Button>
                    </>
                  )}
                </>
              ) : (
                <div className="bg-success text-background w-full rounded-[10px] py-3 text-center font-semibold">
                  Uploaded successfully
                </div>
              )}
            </div>
          </form>
        </Form>
      </div>

      {/* Display if upload failed */}
      {isErrorUploading && (
        <div className="text-danger mt-4 text-center text-sm font-semibold">
          Upload failed. Please make sure you have a strong internet connection.
        </div>
      )}
    </section>
  );
};

export default StepTwo;
