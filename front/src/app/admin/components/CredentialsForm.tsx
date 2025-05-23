import React from "react";

export default function CredentialsForm() {
  return (
    <>
      <div className="bg-background w-[320px] h-auto rounded-normal flex flex-col p-6 gap-6">
        <div className="flex flex-col">
          <label htmlFor="" className="mb-2">
            Email
          </label>
          <input
            type="email"
            className="border-2 border-border_1 py-2 rounded-[8px] pl-2"
            placeholder="Value"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="" className="mb-2">
            Password
          </label>
          <input
            type="text"
            className="border-2 border-border_1 py-2 rounded-[8px] pl-2"
            placeholder="Value"
          />
        </div>
        <button className="bg-primary py-2 rounded-[8px] text-white">Sign In</button>
        <button className="flex items-start">Forgot password?</button>
      </div>
    </>
  );
}
