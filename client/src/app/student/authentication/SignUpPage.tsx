import { Navigate } from "react-router";
import { useScreenSize } from "@/contexts/useScreenSize";
import { signUpSchema } from "./schema/signUpSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomInput from "@/components/CustomInput";
import { Form } from "@/components/ui/form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import CustomDropdown from "@/components/CustomDropdown";
import { sexAssignedAtBirth } from "./dropdownOptions";
import { CustomCombobox } from "@/components/CustomComboBox";

// Sample data
import districts from "@/test/data/districts.json";

const SignUpPage = () => {
  const { mobile } = useScreenSize();

  // Define form default values
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      contactNumber: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      sexAssignedAtBirth: "",
      street: "",
      district: "",
      municipality: "",
    },
  });

  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] =
    useState<boolean>(false);

  const handleToggleVisibility = (field: string) => {
    if (field === "password") {
      setPasswordVisible((prev) => !prev);
    } else {
      setConfirmPasswordVisible((prev) => !prev);
    }
  };

  const onSubmit = (values: z.infer<typeof signUpSchema>) => {
    console.log(values);
  };

  // Redirect to warning page if screen size is not mobile
  if (!mobile) return <Navigate to="/iEnroll" />;

  return (
    <div className="my-8 flex flex-col items-center">
      <div className="flex flex-col items-center gap-y-8">
        <h2 className="text-accent text-3xl font-semibold">Uy! Ka-iEnroll?</h2>
        <p className="text-text-2 text-sm font-semibold">
          Please fill the form to create an account.
        </p>
      </div>

      <div className="mt-[30px] flex w-screen flex-col gap-y-5 px-14">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="text-primary text-base font-semibold">
              Account Information
            </div>
            <CustomInput
              control={form.control}
              name="username"
              label="Username"
              placeholder="ex. juanieDelaCruz"
              inputStyle="rounded-[10px] bg-container-2 text-sm py-3 px-4 text-text placeholder:text-text-2"
              labelStyle="text-sm text-text-2"
            />

            <CustomInput
              control={form.control}
              name="email"
              label="Email"
              placeholder="ex. juandelacruz@gmail.com"
              inputStyle="rounded-[10px] bg-container-2 text-sm py-3 px-4 text-text placeholder:text-text-2"
              labelStyle="text-sm text-text-2"
            />

            <CustomInput
              control={form.control}
              name="contactNumber"
              label="Contact Number"
              placeholder="ex. 09123465789"
              inputStyle="rounded-[10px] bg-container-2 text-sm py-3 px-4 text-text placeholder:text-text-2"
              labelStyle="text-sm text-text-2"
            />

            <div className="relative">
              <CustomInput
                control={form.control}
                name="password"
                label="Password"
                placeholder="Your password"
                inputStyle="rounded-[10px] bg-container-2 text-sm py-3 px-4 text-text placeholder:text-text-2"
                labelStyle="text-sm text-text-2"
                type={passwordVisible ? "text" : "password"}
              />

              <FontAwesomeIcon
                icon={passwordVisible ? faEyeSlash : faEye}
                className="text-text-2 absolute top-9.5 right-4 w-4"
                onClick={() => handleToggleVisibility("password")}
              />
            </div>

            <div className="relative">
              <CustomInput
                control={form.control}
                name="confirmPassword"
                label="Confirm password"
                placeholder="Confirm your password"
                inputStyle="rounded-[10px] bg-container-2 text-sm py-3 px-4 text-text placeholder:text-text-2"
                labelStyle="text-sm text-text-2"
                type={confirmPasswordVisible ? "text" : "password"}
              />

              <FontAwesomeIcon
                icon={confirmPasswordVisible ? faEyeSlash : faEye}
                className="text-text-2 absolute top-9.5 right-4 w-4"
                onClick={() => handleToggleVisibility("confirmPassword")}
              />
            </div>

            <div className="text-primary mt-10 text-base font-semibold">
              Personal Information
            </div>
            <CustomInput
              control={form.control}
              name="firstName"
              label="First Name"
              placeholder="ex. Juanie"
              inputStyle="rounded-[10px] bg-container-2 text-sm py-3 px-4 text-text placeholder:text-text-2"
              labelStyle="text-sm text-text-2"
            />

            <CustomInput
              control={form.control}
              name="middleName"
              label="Middle Name (optional)"
              placeholder="ex. Santos"
              inputStyle="rounded-[10px] bg-container-2 text-sm py-3 px-4 text-text placeholder:text-text-2"
              labelStyle="text-sm text-text-2"
            />

            <CustomInput
              control={form.control}
              name="lastName"
              label="Last Name"
              placeholder="ex. Dela Cruz"
              inputStyle="rounded-[10px] bg-container-2 text-sm py-3 px-4 text-text placeholder:text-text-2"
              labelStyle="text-sm text-text-2"
            />

            <CustomInput
              control={form.control}
              name="dateOfBirth"
              label="Date of Birth"
              placeholder="Select your date of birth"
              inputStyle="rounded-md p-2 border"
              labelStyle="text-sm font-medium text-text-2"
              type="date"
            />

            <CustomDropdown
              control={form.control}
              name="sexAssignedAtBirth"
              values={sexAssignedAtBirth}
              buttonClassName="w-full mr-14 mr-4 rounded-[10px] bg-background px-4 py-2 text-sm transition-all ease-in-out hover:text-secondary"
              menuClassName="w-full rounded-[10px] bg-white"
              itemClassName="rounded-[10px] px-4 py-2 transition-all ease-in-out"
              label="Sex assigned at birth"
              labelClassName="text-sm text-text-2"
            />

            <div className="text-primary mt-10 text-base font-semibold">
              Address
            </div>
            <CustomInput
              control={form.control}
              name="street"
              label="Street"
              placeholder="ex. Cauayan Street"
              inputStyle="rounded-[10px] bg-container-2 text-sm py-3 px-4 text-text placeholder:text-text-2"
              labelStyle="text-sm text-text-2"
            />

            {/* <CustomInput
              control={form.control}
              name="district"
              label="District"
              placeholder="ex. Second District"
              inputStyle="rounded-[10px] bg-container-2 text-sm py-3 px-4 text-text placeholder:text-text-2"
              labelStyle="text-sm text-text-2"
            /> */}

            <CustomCombobox 
              control={form.control}
              name="district"
              label="District"
              labelClassName="text-sm font-semibold text-text-2"
              values={districts}
              placeholder="Enter district..."
            />

            <CustomInput
              control={form.control}
              name="municipality"
              label="City/Municipality"
              placeholder="ex. Legazpi City"
              inputStyle="rounded-[10px] bg-container-2 text-sm py-3 px-4 text-text placeholder:text-text-2"
              labelStyle="text-sm text-text-2"
            />

            <Button
              className="bg-accent mt-[30px] w-full py-6 text-base"
              type="submit"
            >
              Create account
            </Button>
          </form>
        </Form>

        <div className="text-text-2 text-center text-sm font-semibold">
          Already have an account?{" "}
          <a className="text-accent" href="/log-in">
            Log in
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
