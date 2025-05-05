/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { z } from "zod";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { capitalizeFirstCharacter } from "@/utils/stringUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { cn } from "@/lib/utils";
import { ReactNode, useEffect } from "react";
import clsx from "clsx";
import { Control, Path, useWatch } from "react-hook-form";

export type DropdownItem = {
  id: string | number;
  label: string;
  sublabel?: string;
};

type CustomDropdownProps<TSchema extends z.ZodType<any, any>> = {
  control: Control<z.infer<TSchema>>;
  name: Path<z.infer<TSchema>>;
  triggerName?: string;
  values: DropdownItem[];
  value?: string | number;

  // New onChange hook
  onChangeValue?: (value: DropdownItem | null) => void;

  // Styling props with better defaults
  buttonClassName?: string;
  menuClassName?: string;
  itemClassName?: string;
  label?: ReactNode;
  labelClassName?: string;

  // Additional customization
  icon?: ReactNode;
  disabled?: boolean;
  placeholder?: string;
};

const CustomDropdown = <TSchema extends z.ZodType<any, any>>({
  control,
  name,
  values,
  onChangeValue,
  buttonClassName,
  menuClassName,
  itemClassName,
  label,
  labelClassName,
  icon = <FontAwesomeIcon icon={faChevronDown} className="ml-2" />,
  disabled = false,
  placeholder = "Select a value",
}: CustomDropdownProps<TSchema>) => {
  // Watch the current value
  const watchedValue = useWatch({ control, name });

  // Trigger callback if value changes
  useEffect(() => {
    const matched = values.find(
      (item) => item.id.toString() === watchedValue?.toString(),
    );
    onChangeValue?.(matched ?? null);
  }, [watchedValue, values, onChangeValue]);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedItem = values.find(
          (item) => item.id.toString() === field.value?.toString(),
        );

        return (
          <FormItem>
            <FormLabel className={clsx(labelClassName)}>{label}</FormLabel>
            <FormControl>
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  disabled={disabled}
                  className={`border ${fieldState?.error ? "border-danger" : ""}`}
                >
                  <Button
                    className={cn(
                      "flex w-full items-center justify-between",
                      selectedItem
                        ? "text-foreground"
                        : "text-muted-foreground",
                      buttonClassName,
                    )}
                  >
                    <span>
                      {capitalizeFirstCharacter(
                        selectedItem?.label ||
                          watchedValue?.toString() ||
                          placeholder,
                      )}
                    </span>
                    {icon}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className={cn("p-0", menuClassName)}
                  align="start"
                  sideOffset={4}
                >
                  {values.map((item) => (
                    <DropdownMenuItem
                      key={item.id}
                      className={cn("cursor-pointer px-4 py-2", itemClassName)}
                      onSelect={() => field.onChange(item.id.toString())}
                    >
                      <div className="flex flex-col">
                        <span>{item.label}</span>
                        {item.sublabel && (
                          <span className="text-text-2 text-xs font-normal">
                            {item.sublabel}
                          </span>
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default CustomDropdown;
