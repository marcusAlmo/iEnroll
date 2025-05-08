/* eslint-disable @typescript-eslint/no-explicit-any */
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";

// Sample data
// import requirements from "@/test/data/requirements.json";
// import fees from "@/test/data/fees.json";
// import paymentMethods from "@/test/data/payment-methods.json";
import { useForm } from "react-hook-form";
import Enums, {
  accepted_data_type,
  requirement_type,
} from "@/services/common/types/enums";
import { useNavigate } from "react-router";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAllRequirementsForReupload,
  resubmitInvalidRequirements,
} from "@/services/mobile-web-app/re-upload/src";
import { generateSchemaFromRequirements } from "../../enrollment/schema/RequirementsSchema";
import UploadBox from "../../enrollment/components/UploadBox";

interface Requirement {
  requirementId: number;
  name: string;
  requirementType: requirement_type;
  acceptedDataTypes: accepted_data_type;
  isRequired: boolean;
}

const ReuploadPage = () => {
  const navigate = useNavigate();

  const [requirementsSchema, setRequirementsSchema] = useState<
    z.ZodObject<any>
  >(z.object({}));
  const [requirementsDefaultValues, setRequirementsDefaultValues] = useState<
    Record<string, any>
  >({});

  const form = useForm<z.infer<typeof requirementsSchema>>({
    resolver: zodResolver(requirementsSchema),
    defaultValues: { ...requirementsDefaultValues },
  });

  const {
    mutate: mutateResubmit,
    isPending: isMutateResubmitPending,
    isError: isMutateResubmitError,
    isSuccess: isMutateResubmitSuccess,
  } = useMutation({
    mutationKey: ["resubmitRequirements"],
    mutationFn: resubmitInvalidRequirements,
  });

  const [showRequirementsTooltip, setShowRequirementsTooltip] =
    useState<boolean>(false);

  const { data: requirements, isPending: isRequirementsPending } = useQuery({
    queryKey: ["studentEnrollmentRequirementsForReupload"],
    queryFn: getAllRequirementsForReupload,
    select: (data) => {
      const sortOrder = { text: 0, image: 1, document: 2 } as Record<
        requirement_type,
        number
      >;
      return data.data
        .map<Requirement>((req) => ({
          requirementId: req.requirementId,
          name: req.name,
          requirementType: req.requirementType,
          acceptedDataTypes: req.acceptedDataTypes,
          isRequired: req.isRequired ?? false,
        }))
        .sort(
          (a, b) => sortOrder[a.requirementType] - sortOrder[b.requirementType],
        );
    },
  });

  useEffect(() => {
    if (!isRequirementsPending && requirements) {
      const dynamicSchema = generateSchemaFromRequirements(requirements);
      setRequirementsSchema(dynamicSchema);
      setRequirementsDefaultValues(
        Object.fromEntries(
          requirements.map((r) => [r.requirementId, undefined]),
        ),
      );
    }
  }, [isRequirementsPending, requirements]);

  const onSubmit = useCallback(
    (data: any) => {
      console.log(data);
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
      formData.append("requirements", JSON.stringify(requirementPayloads));

      mutateResubmit(formData, {
        onSuccess: (data) => {
          console.log(data);
          alert("Enrollment application success!");
          navigate("/student/dashboard");
        },
        onError: (error) => {
          console.log(error);
          alert("Something went wrong, try again.");
        },
      });
    },
    [mutateResubmit, navigate, requirements],
  );

  return (
    <section className="bg-container-1 flex w-screen flex-col items-center justify-center p-12">
      <div className="space-y-1.5 text-center">
        <h1 className="text-accent text-3xl font-semibold">
          {isMutateResubmitSuccess
            ? "Nice, uploaded na ulit!"
            : "Uy, requirements ulit!"}
        </h1>
        <p className="text-text-2 text-sm font-semibold">
          {requirements?.length
            ? "Please resubmit the needed requirements"
            : "You have no invalid requirements. You are good to go!"}
        </p>
      </div>

      {requirements?.length ? (
        <>
          <div className="bg-accent mt-6 space-x-1 rounded-[10px] px-2.5 py-0.5">
            <span className="text-sm font-semibold">
              Need help? Just tap the{" "}
              <FontAwesomeIcon icon={faInfoCircle} className="text-primary" />{" "}
              icon!
            </span>
          </div>

          <div className="mt-8 w-screen px-14">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="w-full">
                  <div className="relative mb-4 inline-block">
                    <span className="text-primary text-base font-semibold">
                      Requirements
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        className="text-text-2/40 ml-2"
                        onClick={() =>
                          setShowRequirementsTooltip((prev) => !prev)
                        }
                      />
                    </span>
                    {showRequirementsTooltip && (
                      <div className="absolute top-[5%] right-[-105%] z-10 w-32 rounded-[10px] bg-slate-300 p-2 text-xs">
                        Please upload the documentary requirements for
                        enrollment. Allow necessary permissions during upload
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

                <div className="flex flex-col items-center gap-y-2">
                  {!isMutateResubmitSuccess ? (
                    <>
                      <Button
                        type="submit"
                        disabled={isMutateResubmitPending}
                        className={`text-background bg-accent w-full rounded-[10px] py-6 font-semibold`}
                      >
                        {isMutateResubmitPending
                          ? "Submitting"
                          : "Resubmit Requirements"}
                      </Button>

                      {/* Only display when the form is partially filled */}
                      {form.formState.isDirty && (
                        <>
                          <span className="text-text-2 text-sm">or</span>
                          <Button
                            onClick={() =>
                              alert("Save as draft not yet working!")
                            }
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
          {isMutateResubmitError && (
            <div className="text-danger mt-4 text-center text-sm font-semibold">
              An error occured. Please try again.
            </div>
          )}
        </>
      ) : (
        <>
          <Button
            type="button"
            onClick={() => navigate("/student/dashboard")}
            className={`text-background bg-accent w-full rounded-[10px] py-6 font-semibold`}
          >
            Go Back
          </Button>
        </>
      )}
    </section>
  );
};

export default ReuploadPage;
