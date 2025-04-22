import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router";
import { AxiosError } from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { useScreenSize } from "@/contexts/useScreenSize";
import { useAuth } from "@/contexts/useAuth";
import { getAnnoucements } from "@/services/mobile-web-app/landing";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomInput from "@/components/CustomInput";
import CustomCarousel from "@/components/CustomCarousel";

import { signInSchema } from "./schema/signInSchema";

const LoginPage = () => {
  const navigate = useNavigate();
  const { mobile } = useScreenSize();
  const { loginMobile } = useAuth();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState<string>();

  const { data: announcements, error: announcementError } = useQuery({
    queryKey: ["announcements"],
    queryFn: getAnnoucements,
    select: (data) =>
      data.data.map((a, idx) => ({
        id: idx,
        subject: a.subject,
        message: a.message,
      })),
  });

  useEffect(() => {
    if (announcementError) setError(announcementError.message);
  }, [announcementError]);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { username: "", password: "" },
  });

  const { mutate: login, isPending: isLoginPending } = useMutation({
    mutationFn: ({ username, password }: { username: string; password: string }) =>
      loginMobile(username, password),
    onSuccess: () => navigate("/student/dashboard"),
    onError: (err) => {
      if (err instanceof AxiosError) {
        let msg = err.response?.data.message;
        if (msg === "ERR_USER_NOT_FOUND") msg = "User not found.";
        if (msg === "ERR_INVALID_PASSWORD") msg = "Password not matched.";
        setError(msg);
      } else {
        setError((err as Error).message);
      }
    },
  });

  const onSubmit = (data: z.infer<typeof signInSchema>) => {
    setError(undefined);
    login(data);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  if (!mobile) return <Navigate to="/iEnroll" />;

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h2 className="text-accent text-3xl font-semibold">Announcements</h2>

      <div className="mt-8 mb-16 flex w-screen justify-center">
        {announcements?.length ? (
          <CustomCarousel carouselItems={announcements} />
        ) : (
          <div>No announcements found.</div>
        )}
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
                    className="text-text-2 absolute top-9.5 right-4 w-4 cursor-pointer"
                    onClick={togglePasswordVisibility}
                  />
                </div>
                <div
                  className="cursor-pointer self-end text-xs font-semibold text-[#DD3545]/70"
                  onClick={() => setShowModal(true)}
                >
                  Forgot password?
                </div>
              </div>

              {error && (
                <div className="text-center text-sm text-red-500">
                  <p>{error}</p>
                </div>
              )}

              <Button
                className="bg-accent mt-[30px] w-full py-6 text-base"
                type="submit"
                disabled={isLoginPending}
              >
                {isLoginPending ? "Logging in..." : "Log in"}
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
