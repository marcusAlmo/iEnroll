/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { z } from "zod";
import { Calendar } from 'primereact/calendar';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Control, Path } from "react-hook-form";
import clsx from "clsx";

type CustomInputProps<TSchema extends z.ZodType<any, any>> = {
  control: Control<z.infer<TSchema>>;
  name: Path<z.infer<TSchema>>;
  label: string;
  placeholder: string;
  inputStyle: string;
  labelStyle: string;
  type?: "text" | "password" | "date"; 
};

const CustomInput = <TSchema extends z.ZodType<any, any>>({
  control,
  name,
  label,
  placeholder,
  inputStyle,
  labelStyle,
  type = "text",
}: CustomInputProps<TSchema>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel className={clsx(labelStyle)}>{label}</FormLabel>
          <FormControl>
            {type === "date" ? (
              <Calendar
                value={field.value ? new Date(field.value) : null}
                onChange={(e) => field.onChange(e.value ? e.value.toISOString().split("T")[0] : "")} dateFormat="mm/dd/yy"
                placeholder="MM/DD/YYYY"
                showIcon
                invalid={!!fieldState.error} 
                pt={{
                  root: { 
                    className: `rounded-[10px] bg-container-2 text-sm py-2 px-4 border 
                      ${fieldState?.error ? "border-red-500" : "border-container-2"}`
                  },
                  panel: { className: "bg-background p-3 rounded-[10px] border" },
                  input: { className: `text-sm ${fieldState?.error ? "text-red-500" : ""}` },
                  day: { className: "p-2" },
                  month: { className: "p-2" }, 
                  year: { className: "p-2" }
                }}
              />
            ) : (
              <Input
                {...field}
                className={clsx(inputStyle)}
                placeholder={placeholder}
                type={type}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default CustomInput;
