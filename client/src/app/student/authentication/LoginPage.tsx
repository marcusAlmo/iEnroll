import { Navigate } from "react-router";
import { Form } from "@/components/ui/form";
import { useScreenSize } from "@/contexts/useScreenSize";
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
import { useAuth } from "@/contexts/useAuth";
import { AxiosError } from "axios";

const LoginPage = () => {
  const { mobile } = useScreenSize();
  const { loginMobile } = useAuth();

  // States
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  // Define form default values
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    console.log(data);
    try {
      await loginMobile(data.username, data.password);

      return <Navigate to="/student/dashboard" />;
    } catch (error) {
      if (error instanceof AxiosError) {
        let msg = error.response?.data.message;

        switch (msg) {
          case "ERR_USER_NOT_FOUND":
            msg = "User not found";
            break;
          case "ERR_INVALID_PASSWORD":
            msg = "User not found";
        }
        setError(msg);
      } else setError(error.message);
    }
  };

  const handleToggleVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  // If screen size not mobile, redirect to Warning Page
  if (!mobile) return <Navigate to="/iEnroll" />;

  // Else display the following TSX
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h2 className="text-accent text-3xl font-semibold">Announcements</h2>

      <div className="mt-8 mb-16 flex w-screen justify-center">
        <CustomCarousel carouselItems={announcements} />
      </div>

      <div>
        <h2 className="text-primary text-center text-3xl font-semibold">
          Uy! Kumusta<span className="text-warning">?</span>
        </h2>
        <p className="text-text-2 py-2 text-center text-xs font-semibold">
          Please log into your account
        </p>

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
                    className="text-text-2 absolute top-9.5 right-4 w-4"
                    onClick={() => handleToggleVisibility()}
                  />
                </div>
                <div
                  className="self-end text-xs font-semibold text-[#DD3545]/70"
                  onClick={() => setShowModal(true)}
                >
                  Forgot password?
                </div>
              </div>
              {error && (
                <div>
                  <p>{error}</p>
                </div>
              )}
              <Button
                className="bg-accent mt-[30px] w-full py-6 text-base"
                type="submit"
              >
                Log in
              </Button>
            </form>
          </Form>

          <div className="text-text-2 mt-2 text-center text-sm font-semibold">
            Don't have an account yet?{" "}
            <a className="text-accent" href="/sign-up">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
