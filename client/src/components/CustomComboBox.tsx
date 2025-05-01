/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Control, Path } from "react-hook-form";
import { z } from "zod";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { ReactNode } from "react";
import { clsx } from "clsx";

type CustomComboBoxProps<TSchema extends z.ZodType<any, any>> = {
  control: Control<z.infer<TSchema>>;
  name: Path<z.infer<TSchema>>;
  values: Options[];
  label?: ReactNode;
  labelClassName?: string;
  placeholder: string;
};

type Options = {
  id: number;
  label: string;
  value: string;
};

export const CustomCombobox = <TSchema extends z.ZodType<any, any>>({
  control,
  name,
  values,
  label,
  labelClassName,
  placeholder = "Enter a value...",
}: CustomComboBoxProps<TSchema>) => {
  const [open, setOpen] = React.useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const filteredItems = values.filter((item) =>
          item.label.toLowerCase().includes(String(field.value ?? "").toLowerCase())
        );

        const isExactMatch = values.some(
          (item) => item.label.toLowerCase() === String(field.value ?? "").toLowerCase()
        );

        return (
          <FormItem>
            <FormLabel className={clsx(labelClassName)}>{label}</FormLabel>
            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                      "w-full justify-between font-normal",
                      field.value ? "text-text" : "text-text-2"
                    )}
                  >
                    {field.value || placeholder}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Search or enter..."
                      value={field.value ?? ""}
                      onValueChange={field.onChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (field.value && !isExactMatch) {
                            field.onChange(field.value); // Accept custom input
                            setOpen(false);
                          }
                        }
                      }}
                    />
                    <CommandEmpty 
                      onClick={(e) => {
                        e.preventDefault();
                        if (field.value && !isExactMatch) {
                          field.onChange(field.value); // Accept custom input
                          setOpen(false);
                        }
                      }}
                      className="ml-6 text-start p-2 text-sm"
                    >
                      {field.value}
                    </CommandEmpty>
                    <CommandGroup>
                      {filteredItems.map((item) => (
                        <CommandItem
                          key={item.value}
                          onSelect={() => {
                            field.onChange(item.label);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === item.label ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {item.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

