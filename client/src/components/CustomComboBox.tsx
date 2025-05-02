/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { useEffect, ReactNode } from "react";
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
import { Control, Path, useWatch } from "react-hook-form";
import { z } from "zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { clsx } from "clsx";

type Options = {
  id: number;
  label: string;
  value: string;
};

type CustomComboBoxProps<TSchema extends z.ZodType<any, any>> = {
  control: Control<z.infer<TSchema>>;
  name: Path<z.infer<TSchema>>;
  values: Options[];
  label?: ReactNode;
  labelClassName?: string;
  placeholder: string;
  onChangeValue?: (value: Options | null) => void;
  onChangeIsExactMatch?: (isExactMatch: boolean) => void;
};

export const CustomCombobox = <TSchema extends z.ZodType<any, any>>({
  control,
  name,
  values,
  label,
  labelClassName,
  placeholder = "Enter a value...",
  onChangeValue,
  onChangeIsExactMatch,
}: CustomComboBoxProps<TSchema>) => {
  const [open, setOpen] = React.useState(false);

  const value = useWatch({ control, name }) ?? "";
  const selectedOption = values.find(
    (item) =>
      item.label.toLowerCase() === (value ? String(value).toLowerCase() : ""),
  );
  const isExactMatch = !!selectedOption;

  useEffect(() => {
    onChangeValue?.(selectedOption || null);
    onChangeIsExactMatch?.(isExactMatch);
  }, [selectedOption, isExactMatch, onChangeValue, onChangeIsExactMatch]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const filteredItems = values.filter((item) =>
          item.label.toLowerCase().includes(String(value).toLowerCase()),
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
                      value ? "text-text" : "text-text-2",
                    )}
                  >
                    {selectedOption?.label || placeholder}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Search or enter..."
                      value={value}
                      onValueChange={(val) => {
                        field.onChange(val);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (value && !isExactMatch) {
                            field.onChange(value);
                            setOpen(false);
                          }
                        }
                      }}
                    />
                    <CommandEmpty
                      onClick={(e) => {
                        e.preventDefault();
                        if (value && !isExactMatch) {
                          field.onChange(value);
                          setOpen(false);
                        }
                      }}
                      className="ml-6 p-2 text-start text-sm"
                    >
                      {value}
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
                              value === item.label
                                ? "opacity-100"
                                : "opacity-0",
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
