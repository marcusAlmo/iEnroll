/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useForm, UseFormReturn, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { EnrollContext } from "./context";
import {
  getAcademicLevelsBySchool,
  getGradeLevelsByAcademicLevel,
  getSchedulesByGradeLevel,
  getSectionsByGradeLevel,
} from "@/services/mobile-web-app/enrollment/step-one/src";
import {
  getAllGradeSectionTypeRequirements,
  getPaymentMethodDetails,
} from "@/services/mobile-web-app/enrollment/step-two/src";
import { generateSchemaFromRequirements } from "../../enrollment/schema/RequirementsSchema";
import { stepOneSchema } from "../../enrollment/schema/StepOneSchema";
import { stepTwoSchema } from "../../enrollment/schema/StepTwoSchema";
import { sanitizeName } from "@/utils/stringUtils";
import { ScheduleResponse } from "@/services/mobile-web-app/enrollment/step-one/types";
import {
  accepted_data_type,
  requirement_type,
} from "@/services/common/types/enums";

// Interfaces and Types
interface Requirement {
  requirementId: number;
  name: string;
  requirementType: requirement_type;
  acceptedDataTypes: accepted_data_type;
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
type StepOneSchema = z.infer<typeof stepOneSchema>;

export interface EnrollContextProps {
  showSubmitStep1: boolean;
  setShowSubmitStep1: Dispatch<SetStateAction<boolean>>;
  stepOneForm: UseFormReturn<StepOneSchema>;
  stepTwoForm: UseFormReturn<any>;
  levels: LevelOption[] | undefined;
  gradeLevels: GradeLevelOption[] | undefined;
  programs: ProgramOption[] | undefined;
  sections: SectionOption[] | undefined;
  schedules: ScheduleResponse | undefined;
  requirements: Requirement[] | undefined;
  paymentMethods: PaymentMethod[] | undefined;
  fees: Fee[] | undefined;
  setCurrentStep: Dispatch<SetStateAction<1 | 2 | undefined>>;
  setIsStepOneFinished: Dispatch<SetStateAction<boolean | undefined>>;
}

// Component
export const EnrollProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const navigate = useNavigate();

  // State
  const [currentStep, setCurrentStep] = useState<1 | 2>();
  const [isStepOneFinished, setIsStepOneFinished] = useState<boolean>();
  const [showSubmitStep1, setShowSubmitStep1] = useState(false);
  const [requirementsSchema, setRequirementsSchema] = useState<
    z.ZodObject<any>
  >(z.object({}));
  const [requirementsDefaultValues, setRequirementsDefaultValues] = useState<
    Record<string, any>
  >({});

  // Navigation
  useEffect(() => {
    if (currentStep === 2 && !isStepOneFinished)
      navigate("/student/enroll/step-1");
  }, [currentStep, isStepOneFinished, navigate]);

  // Forms
  const stepTwoFinalSchema = useMemo(
    () => stepTwoSchema.merge(requirementsSchema),
    [requirementsSchema],
  );

  const stepTwoForm = useForm<z.infer<typeof stepTwoFinalSchema>>({
    resolver: zodResolver(stepTwoFinalSchema),
    defaultValues: { ...requirementsDefaultValues },
  });

  const stepOneForm = useForm<StepOneSchema>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      level: "",
      gradeLevel: "",
      program: "",
      section: "",
      enrollmentDate: undefined,
      enrollmentTime: undefined,
    },
  });

  // Queries and Data Fetching
  const { data: levels } = useQuery({
    queryKey: ["studentEnrollmentLevelSelection"],
    queryFn: getAcademicLevelsBySchool,
    select: (data): LevelOption[] =>
      data.data.map((level) => ({
        id: level.academicLeveLCode,
        label: level.academicLevel,
      })),
  });

  const selectedLevelId = useWatch({
    control: stepOneForm.control,
    name: "level",
  });

  useEffect(() => {
    stepOneForm.setValue("gradeLevel", "");
    stepOneForm.setValue("program", "");
    stepOneForm.setValue("section", "");
    setShowSubmitStep1(false);
  }, [stepOneForm, selectedLevelId]);

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
    control: stepOneForm.control,
    name: "gradeLevel",
  });

  useEffect(() => {
    stepOneForm.setValue("program", "");
    stepOneForm.setValue("section", "");
    setShowSubmitStep1(false);
  }, [stepOneForm, selectedGradeLevelId]);

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
    control: stepOneForm.control,
    name: "program",
  });

  useEffect(() => {
    stepOneForm.setValue("section", "");
    setShowSubmitStep1(false);
  }, [stepOneForm, selectedProgramId]);

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

  // Context Value
  const value = useMemo<EnrollContextProps>(
    () => ({
      showSubmitStep1,
      setShowSubmitStep1,
      stepOneForm,
      stepTwoForm,
      levels,
      gradeLevels,
      programs,
      sections,
      schedules,
      requirements,
      paymentMethods,
      fees,
      setCurrentStep,
      setIsStepOneFinished,
    }),
    [
      showSubmitStep1,
      stepOneForm,
      stepTwoForm,
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
