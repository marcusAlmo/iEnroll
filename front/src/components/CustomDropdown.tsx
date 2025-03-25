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
import { ReactNode } from "react";
import clsx from "clsx";
import { Control, Path } from "react-hook-form";

export type DropdownItem = {
  id: string | number;
  label: string;
};

type CustomDropdownProps<TSchema extends z.ZodType<any, any>> = {
  control: Control<z.infer<TSchema>>;
  name: Path<z.infer<TSchema>>;
  triggerName?: string;
  values: DropdownItem[];
  value?: string | number;
  
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
  value,
  buttonClassName,
  menuClassName,
  itemClassName,
  label,
  labelClassName,
  icon = <FontAwesomeIcon icon={faChevronDown} className="ml-2" />,
  disabled = false,
  placeholder = "Select a value"
}: CustomDropdownProps<TSchema>) => {
  const selectedItem = values.find(item => item.id.toString() === value?.toString());

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem>
          <FormLabel className={clsx(labelClassName)}>{label}</FormLabel>
          <FormControl>
            <DropdownMenu>
              <DropdownMenuTrigger asChild disabled={disabled} className={`border ${fieldState?.error ? "border-danger" : "" }`}>
                <Button 
                  className={cn(
                    "flex justify-between items-center w-full",
                    selectedItem ? "text-foreground" : "text-muted-foreground",
                    buttonClassName
                  )}
                >
                  <span>{capitalizeFirstCharacter(values.find((v) => v.id.toString() === field.value)?.label || placeholder)}</span>
                  {icon}
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent 
                className={cn("w-full min-w-[8rem] p-0", menuClassName)}
                align="start"
                sideOffset={4}
              >
                {values.map((item) => (
                  <DropdownMenuItem
                    key={item.id}
                    className={cn("cursor-pointer w-full py-2 px-4", itemClassName)}
                    onSelect={() => field.onChange(item.id.toString())}
                  >
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    >
    </FormField>
  );
};

export default CustomDropdown;
