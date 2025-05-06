"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { useForm, UseFormReturn, useWatch } from "react-hook-form";
import { z } from "zod";
import { EnrollContext } from "./context";
import {
  getAcademicLevelsBySchool,
  getGradeLevelsByAcademicLevel,
  getSchedulesByGradeLevel,
  getSectionsByGradeLevel,
} from "@/services/mobile-web-app/enrollment/step-one/src";
import { useQuery } from "@tanstack/react-query";
import { ScheduleResponse } from "@/services/mobile-web-app/enrollment/step-one/types";
import { enrollSchema } from "./enrollSchema";
import {
  getAllGradeSectionTypeRequirements,
  getPaymentMethodDetails,
} from "@/services/mobile-web-app/enrollment/step-two/src";
import { generateSchemaFromRequirements } from "../../enrollment/schema/RequirementsSchema";
import { sanitizeName } from "@/utils/stringUtils";

interface Requirement {
  requirementId: number;
  name: string;
  requirementType: string;
  acceptedDataTypes: string;
  isRequired: boolean;
}

interface PaymentMethod {
  id: number;
  methodName: string;
  methodType: string;
  accountNumber: string;
  ownerName: string;
}

interface FeeBreakdown {
  feeBreakdown: string;
  feeAmount: number;
}

interface Fee {
  feeType: string;
  feeDetails: string;
  feeBreakdown: FeeBreakdown[];
}

interface Option<T> {
  id: T;
  label: string;
}

type LevelOption = Option<string>;
type GradeLevelOption = Option<string>;
type ProgramOption = Option<string>;
type SectionOption = Option<number>;
// Note: The static enrollSchema already defines fields like schoolName, level, etc.
// We no longer use EnrollSchema directly as the form type because we merge it with the dynamic schema.

export interface EnrollContextProps {
  // step 1
  showSubmitStep1: boolean;
  setShowSubmitStep1: Dispatch<SetStateAction<boolean>>;
  form: UseFormReturn<any>; // using unknown because the schema is now dynamic

  levels: LevelOption[] | undefined;
  gradeLevels: GradeLevelOption[] | undefined;
  programs: ProgramOption[] | undefined;
  sections: SectionOption[] | undefined;
  schedules: ScheduleResponse | undefined;

  // step 2
  requirements: Requirement[] | undefined;
  paymentMethods: PaymentMethod[] | undefined;
  fees: Fee[] | undefined;
}

export const EnrollProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [showSubmitStep1, setShowSubmitStep1] = useState(false);
  const [requirementsSchema, setRequirementsSchema] = useState<
    z.ZodObject<any>
  >(z.object({}));
  const [requirementsDefaultValues, setRequirementsDefaultValues] = useState<
    Record<string, any>
  >({});

  const staticDefaultValues = {
    schoolName: "",
    level: "",
    gradeLevel: "",
    program: "",
    section: "",
    enrollmentDate: undefined,
    enrollmentTime: undefined,

    fatherFN: "",
    fatherMN: "",
    fatherLN: "",
    maidenMotherFN: "",
    maidenMotherMN: "",
    maidenMotherLN: "",
    paymentMethodName: "",
    isAgree: undefined,
    paymentProof: undefined,
  };

  const finalSchema = useMemo(
    () => enrollSchema.merge(requirementsSchema),
    [requirementsSchema],
  );

  const form = useForm<z.infer<typeof finalSchema>>({
    resolver: zodResolver(finalSchema),
    defaultValues: {
      ...staticDefaultValues,
      ...requirementsDefaultValues,
    },
  });

  // Step 1 data
  const { data: levels } = useQuery({
    queryKey: ["studentEnrollmentLevelSelection"],
    queryFn: getAcademicLevelsBySchool,
    select: (data): LevelOption[] =>
      data.data.map((level) => ({
        id: level.academicLeveLCode,
        label: level.academicLevel,
      })),
  });

  const selectedLevelId = useWatch({ control: form.control, name: "level" });

  useEffect(() => {
    form.setValue("gradeLevel", "");
    form.setValue("program", "");
    form.setValue("section", "");
    setShowSubmitStep1(false);
  }, [form, selectedLevelId]);

  const { data: gradeLevels } = useQuery({
    queryKey: ["studentEnrollmentGradeLevelSelection", selectedLevelId],
    queryFn: () => getGradeLevelsByAcademicLevel(selectedLevelId),
    select: (data): GradeLevelOption[] =>
      data.data.map((level) => ({
        id: level.gradeLevelCode,
        label: level.gradeLevel,
      })),
    enabled: Boolean(selectedLevelId),
  });

  const selectedGradeLevelId = useWatch({
    control: form.control,
    name: "gradeLevel",
  });

  useEffect(() => {
    form.setValue("program", "");
    form.setValue("section", "");
    setShowSubmitStep1(false);
  }, [form, selectedGradeLevelId]);

  const { data: programSections } = useQuery({
    queryKey: [
      "studentEnrollmentProgramSectionSelection",
      selectedGradeLevelId,
    ],
    queryFn: () => getSectionsByGradeLevel(selectedGradeLevelId),
    select: (data) => data.data,
    enabled: Boolean(selectedGradeLevelId),
  });

  const programs = useMemo(() => {
    return programSections?.map<ProgramOption>((p) => ({
      id: p.programId,
      label: p.programName,
    }));
  }, [programSections]);

  const selectedProgramId = useWatch({
    control: form.control,
    name: "program",
  });

  useEffect(() => {
    form.setValue("section", "");
    setShowSubmitStep1(false);
  }, [form, selectedProgramId]);

  const sections = useMemo(() => {
    const program = programSections?.find(
      (p) => p.programId === selectedProgramId,
    );
    return program?.sections.map<SectionOption>((s) => ({
      id: s.gradeSectionId,
      label: s.sectionName,
    }));
  }, [programSections, selectedProgramId]);

  const { data: schedules } = useQuery({
    queryKey: [
      "studentEnrollmentProgramScheduleSelection",
      selectedGradeLevelId,
    ],
    queryFn: () => getSchedulesByGradeLevel(selectedGradeLevelId),
    select: (data) => data.data,
    enabled: Boolean(selectedGradeLevelId),
  });

  const gradeSectionProgramId = useMemo(() => {
    return programSections?.find((p) => p.programId === selectedProgramId)
      ?.gradeSectionProgramId;
  }, [programSections, selectedProgramId]);

  const { data: requirements, isPending: isRequirementsPending } = useQuery({
    queryKey: ["studentEnrollmentRequirements", gradeSectionProgramId],
    queryFn: () => getAllGradeSectionTypeRequirements(gradeSectionProgramId!),
    select: (data) => {
      return data.data.map<Requirement>((req) => ({
        requirementId: req.requirementId,
        name: req.name,
        requirementType: req.requirementType,
        acceptedDataTypes: req.acceptedDataTypes,
        isRequired: req.isRequired ?? false,
      }));
    },
    enabled: Boolean(gradeSectionProgramId),
  });

  useEffect(() => {
    if (!isRequirementsPending && requirements) {
      const dynamicSchema = generateSchemaFromRequirements(requirements);
      setRequirementsSchema(dynamicSchema);
      setRequirementsDefaultValues(
        Object.fromEntries(
          requirements.map((r) => [sanitizeName(r.name), undefined]),
        ),
      );
    }
  }, [isRequirementsPending, requirements]);

  const { data: paymentData } = useQuery({
    queryKey: ["studentEnrollmentPaymentMethods", gradeSectionProgramId],
    queryFn: () => getPaymentMethodDetails(gradeSectionProgramId!),
    select: (data) => data.data,
    enabled: Boolean(gradeSectionProgramId),
  });

  const paymentMethods = useMemo(
    () =>
      paymentData?.paymentOptions.map<PaymentMethod>((method) => ({
        id: method.id,
        methodName: method.provider,
        methodType: "N/A",
        accountNumber: method.accountNumber,
        ownerName: method.accountName,
      })),
    [paymentData?.paymentOptions],
  );

  const fees = useMemo(
    () =>
      paymentData?.fees.map<Fee>((fee) => ({
        feeType: fee.name,
        feeDetails: fee.description ?? "No description",
        feeBreakdown: [
          {
            feeBreakdown: fee.name,
            feeAmount: fee.amount,
          },
        ],
      })),
    [paymentData?.fees],
  );

  const value = useMemo<EnrollContextProps>(
    () => ({
      showSubmitStep1,
      setShowSubmitStep1,
      form,
      levels,
      gradeLevels,
      programs,
      sections,
      schedules,
      requirements,
      paymentMethods,
      fees,
    }),
    [
      showSubmitStep1,
      form,
      levels,
      gradeLevels,
      programs,
      sections,
      schedules,
      requirements,
      paymentMethods,
      fees,
    ],
  );

  return (
    <EnrollContext.Provider value={value}>{children}</EnrollContext.Provider>
  );
};
