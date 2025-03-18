"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

// Defining the props
type SearchBarProps = {
  placeholder: string;
  formStyle: string;
  inputStyle: string;
  onSubmit?: (values: { searchInput: string }) => void;
};

const SearchBar = ({
  placeholder,
  formStyle,
  inputStyle,
  onSubmit,
}: SearchBarProps) => {
  // Setting up form handling
  const form = useForm<{ searchInput: string }>({
    defaultValues: {
      searchInput: "",
    },
  });

  const handleFormSubmit = (values: { searchInput: string }) => {
    if (onSubmit) {
      onSubmit(values);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className={formStyle}
      >
        <FormField
          control={form.control}
          name="searchInput"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative inline-block">
                  <Input
                    className={inputStyle}
                    placeholder={placeholder}
                    {...field}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        form.handleSubmit(handleFormSubmit)();
                      }
                    }}
                  />
                  <button type="submit" className="absolute top-5 right-0 pr-7">
                    <FontAwesomeIcon
                      icon={faMagnifyingGlass}
                      className="text-secondary-buttons h-5"
                    />
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default SearchBar;
