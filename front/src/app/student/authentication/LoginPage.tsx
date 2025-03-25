import { Navigate } from "react-router";
import { Form } from "@/components/ui/form";
import { useScreenSize } from "../../../contexts/ScreenSizeContext";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signInSchema } from "./schema/signInSchema";
import CustomInput from "@/components/CustomInput";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";
import CustomCarousel from "@/components/CustomCarousel";
import announcements from "@/test/data/banner-items.json";

const LoginPage = () => {
  const { mobile } = useScreenSize();

  // States
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Define form default values
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: ""
    },
  });

  const onSubmit = (values: z.infer<typeof signInSchema>) => {
    console.log(values)
  };

  const handleToggleVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  // If screen size not mobile, redirect to Warning Page
  if (!mobile) return <Navigate to="/iEnroll" />;

  // Else display the following TSX
  return (
    <div className="py-12 flex flex-col items-center justify-center">
      <h2 className="font-semibold text-accent text-3xl">Announcements</h2>

      <div className="flex justify-center w-screen mb-16 mt-8">
        <CustomCarousel carouselItems={announcements} />
      </div>

      <div>
        <h2 className="text-primary font-semibold text-3xl text-center">Uy! Kumusta<span className="text-warning">?</span></h2>
        <p className="text-text-2 font-semibold text-xs text-center py-2">Please log into your account</p>

        <div className="mt-7.5">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <CustomInput
                control={form.control}
                name="username"
                label="Username"
                placeholder="ex. juanieDelaCruz"
                inputStyle="rounded-[10px] bg-container-2 text-sm py-3 px-4 text-text placeholder:text-text-2"
                labelStyle="text-sm text-text-2"
              />

              <div className="flex flex-col gap-y-4">
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
                    className="absolute top-9.5 right-4 text-text-2 w-4"
                    onClick={() => handleToggleVisibility()}
                  />
                </div>
                <div 
                  className="text-xs font-semibold text-[#DD3545]/70 self-end"
                  onClick={() => setShowModal(true)}  
                >
                  Forgot password?
                </div>
              </div>

              <Button
                className="bg-accent py-6 mt-[30px] text-base w-full"
                type="submit"
              >
                Log in
              </Button>
            </form>
          </Form>

          <div className="text-sm text-center font-semibold text-text-2 mt-2">
            Don't have an account yet? <a className="text-accent" href="/sign-up">Sign up</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
