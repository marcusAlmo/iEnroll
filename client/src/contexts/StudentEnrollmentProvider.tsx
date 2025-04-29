import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router";

type FormProgressContextType = {
  currentStep: number;
  goToStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
};

const FormProgressContext = createContext<FormProgressContextType | undefined>(
  undefined
);

export const StudentEnrollmentProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentStep, setCurrentStep] = useState(1); // Default to step 1
  const navigate = useNavigate();

  const goToStep = (step: number) => {
    setCurrentStep(step);
    navigate(`/student/enroll/step-${step}`);
  };

  const nextStep = () => {
    setCurrentStep((prevStep) => {
      const next = prevStep + 1;
      navigate(`/student/enroll/step-${next}`);
      return next;
    });
  };

  const previousStep = () => {
    setCurrentStep((prevStep) => {
      const prev = prevStep - 1 > 0 ? prevStep - 1 : 1;
      navigate(`/student/enroll/step-${prev}`);
      return prev;
    });
  };

  return (
    <FormProgressContext.Provider
      value={{ currentStep, goToStep, nextStep, previousStep }}
    >
      {children}
    </FormProgressContext.Provider>
  );
};

export const useFormProgress = () => {
  const context = useContext(FormProgressContext);
  if (!context) {
    throw new Error(
      "useFormProgress must be used within a StudentEnrollmentProvider"
    );
  }
  return context;
};