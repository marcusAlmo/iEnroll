/* eslint-disable @typescript-eslint/no-explicit-any */
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { useEnroll } from "../../context/enroll/hook";
import { useWatch } from "react-hook-form";
import Enums from "@/services/common/types/enums";
import { useNavigate } from "react-router";

const StepTwo = () => {
  const {
    stepTwoForm: form,
    requirements,
    paymentMethods,
    fees,
    setCurrentStep,
    enrollmentDetailsPayload,
    mutateEnroll,
    isMutateEnrollError,
    isMutateEnrollPending,
    isMutateEnrollSuccess,
  } = useEnroll();

  const navigate = useNavigate();

  const selectedPaymentMethodId = useWatch({
    control: form.control,
    name: "paymentMethodName",
  });

  const selectedPaymentMethod = useMemo(
    () =>
      selectedPaymentMethodId
        ? paymentMethods?.find(
            (method) => method.id === selectedPaymentMethodId,
          )
        : undefined,
    [paymentMethods, selectedPaymentMethodId],
  );

  useEffect(() => {
    setCurrentStep(2);
  }, [setCurrentStep]);

  const [showRequirementsTooltip, setShowRequirementsTooltip] =
    useState<boolean>(false);
  const [showFeesTooltip, setShowFeesTooltip] = useState<boolean>(false);

  // Calculate fees
  const calculateTotalFees = useCallback(() => {
    return (
      fees?.reduce(
        (total, fee) =>
          total +
          fee.feeBreakdown.reduce(
            (subTotal, breakdown) => subTotal + breakdown.feeAmount,
            0,
          ),
        0,
      ) ?? 0 + (selectedPaymentMethod?.additionalFee ?? 0)
    );
  }, [fees, selectedPaymentMethod?.additionalFee]);

  const onSubmit = useCallback(
    (data: any) => {
      console.log(data);
      const paymentProofFile = data.paymentProof;
      const paymentMethodId = data.paymentMethodName;

      const requirementsWithPayload = Object.entries(data)
        .filter(([key]) => /^\d+$/.test(key)) // keep only numeric string keys
        .sort(([a], [b]) => Number(a) - Number(b)) // sort keys numerically
        .reduce(
          (acc, [key, value]) => {
            acc[key] = value;
            return acc;
          },
          {} as Record<string, any>,
        );

      const files: any[] = [];

      const paymentPayloads = {
        paymentOptionId: +paymentMethodId,
      };
      const requirementPayloads = Object.entries(
        requirementsWithPayload,
      ).flatMap(([key, value]) => {
        const r = requirements?.find((req) => req.requirementId === +key);

        if (r) {
          if (
            r.requirementType === Enums.requirement_type.document ||
            r.requirementType === Enums.requirement_type.image
          )
            files.push(value);
          return [
            {
              requirementId: r.requirementId,
              attachmentType: r.requirementType,
              textContent:
                r.requirementType === Enums.attachment_type.text
                  ? value
                  : undefined,
            },
          ];
        } else return [];
      });

      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      formData.append("files", paymentProofFile);
      formData.append("details", JSON.stringify(enrollmentDetailsPayload));
      formData.append("requirements", JSON.stringify(requirementPayloads));
      formData.append("payment", JSON.stringify(paymentPayloads));

      mutateEnroll(formData, {
        onSuccess: (data) => {
          console.log(data);
          alert("Account created successfully!");
          navigate("/student/dashboard");
        },
        onError: (error) => {
          console.log(error);
          alert("Something went wrong, try again.");
        },
      });
    },
    [enrollmentDetailsPayload, mutateEnroll, navigate, requirements],
  );

  // For dynamically displaying account number and name upon selecting a method
  const selectedPaymentDetails = useMemo(() => {
    return paymentMethods
      ? paymentMethods.find((method) => method.id == selectedPaymentMethodId)
      : undefined;
  }, [paymentMethods, selectedPaymentMethodId]);

  return (
    <section className="bg-container-1 flex w-screen flex-col items-center justify-center p-12">
      <div className="space-y-1.5 text-center">
        <h1 className="text-accent text-3xl font-semibold">
          {isMutateEnrollSuccess ? "Nice, uploaded na!" : "Uy, requirements!"}
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
              {requirements?.map((requirement, index) => {
                const fieldName = requirement.requirementId.toString();
                const error = form.formState.errors[fieldName];

                return (
                  <div key={index} className="mb-6">
                    {/* Render UploadBox for image/document requirements */}
                    {requirement.requirementType === "image" ||
                    requirement.requirementType === "document" ? (
                      <UploadBox
                        control={form.control}
                        name={fieldName}
                        label={requirement.name}
                        requirementType={requirement.requirementType}
                      />
                    ) : (
                      // Render CustomInput for text requirements
                      <CustomInput
                        control={form.control}
                        name={fieldName}
                        label={requirement.name}
                        placeholder={`Enter ${requirement.name}`}
                        inputStyle="rounded-[10px] bg-background border border-border-1 text-sm py-3 px-4 text-text placeholder:text-text-2"
                        labelStyle="text-sm text-text-2"
                        type={
                          requirement.acceptedDataTypes === "string"
                            ? "text"
                            : (requirement.acceptedDataTypes as
                                | "password"
                                | "date"
                                | undefined)
                        }
                      />
                    )}

                    {/* Dynamic error handling */}
                    {error && (
                      <span className="text-danger text-sm">
                        {requirement.requirementType === "image" ||
                        requirement.requirementType === "document"
                          ? "Please upload a file"
                          : "This field is required"}
                      </span>
                    )}
                  </div>
                );
              })}
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
              <p className="text-muted-foreground mt-1 text-xs">
                Additional charges may apply depending on selected services or
                requirements.
              </p>
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
                    id: method.id,
                  })) ?? []
                }
                buttonClassName="rounded-[10px] bg-background px-4 py-2 text-sm transition-all ease-in-out hover:text-secondary"
                menuClassName="w-full rounded-[10px] bg-white"
                itemClassName="rounded-[10px] transition-all ease-in-out"
                label=""
                labelClassName="text-sm text-text-2"
                placeholder="Select payment method"
              />
              {selectedPaymentMethodId && (
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
                requirementType="image"
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
              {!isMutateEnrollSuccess ? (
                <>
                  <Button
                    type="submit"
                    disabled={isMutateEnrollPending}
                    className={`text-background bg-accent w-full rounded-[10px] py-6 font-semibold`}
                  >
                    {isMutateEnrollPending
                      ? "Submitting"
                      : "Submit Requirements"}
                  </Button>

                  {/* Only display when the form is partially filled */}
                  {form.formState.isDirty && (
                    <>
                      <span className="text-text-2 text-sm">or</span>
                      <Button
                        onClick={() => alert("Save as draft not yet working!")}
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
      {isMutateEnrollError && (
        <div className="text-danger mt-4 text-center text-sm font-semibold">
          An error occured. Please try again.
        </div>
      )}
    </section>
  );
};

export default StepTwo;
