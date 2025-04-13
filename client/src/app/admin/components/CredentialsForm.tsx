import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router";
import { requestData } from "@/lib/dataRequester";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
});

type FormData = {
  email: string;
  password: string;
};

export default function CredentialsForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const emailFromQuery = queryParams.get("e");
  const verifiedFromQuery = queryParams.get("v");

  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try{
      console.log("Form submitted", data);

      localStorage.setItem("email", data.email);
      localStorage.setItem("password", data.password);

      window.location.href = "http://localhost:3000/auth/google/callback";
    }catch(error){
      if(error instanceof Error) console.log(error.message);
      else console.log(error);
    }
  };

  const login = async () => {
    if (emailFromQuery && verifiedFromQuery) {
      try{
        const passwordFromQuery = localStorage.getItem("password");
        const emailEntered = localStorage.getItem("email");

        if(!emailEntered) throw new Error("Email not found");

        if(!passwordFromQuery) throw new Error("Password not found");

        if(verifiedFromQuery !== "true") throw new Error("Email not verified");

        // eslint-disable-next-line
        const res = await requestData<any>({
          url: "http://localhost:3000/api/auth/login",
          method: "POST",
          body: {
            email: emailFromQuery,
            emailEntered: emailEntered,
            password: passwordFromQuery,
          }
        });

        if(res){
          navigate("/admin");
        }
      }catch(err) {
        if(err instanceof Error) console.log(err.message);
        else console.log(err);
      }
    }
  }

  // determine if the user is logged in in google
  useEffect(() => {
    login();
  }, [emailFromQuery, verifiedFromQuery]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-container-1 w-[320px] rounded-normal flex flex-col p-6 gap-6 rounded-md"
    >
      <div className="flex flex-col">
        <label htmlFor="email" className="mb-2">
          Email
        </label>
        <input
          {...register("email")}
          type="email"
          id="email"
          className="border-2 border-border_1 py-2 rounded-[8px] pl-2 bg-white"
          placeholder="Email"
        />
        {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
      </div>

      <div className="flex flex-col">
        <label htmlFor="password" className="mb-2">
          Password
        </label>
        <input
          {...register("password")}
          type="password"
          id="password"
          className="border-2 border-border_1 py-2 rounded-[8px] pl-2 bg-white"
          placeholder="Password"
        />
        {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>}
      </div>

      <button
        type="submit"
        className="bg-primary py-2 rounded-[8px] text-white text-center"
      >
        Sign In
      </button>

      <button type="button" className="flex items-start text-blue-500 underline text-sm">
        Forgot password?
      </button>
    </form>
  );
}
