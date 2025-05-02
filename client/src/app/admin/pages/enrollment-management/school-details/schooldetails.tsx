import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from "@/components/ui/form";
import ImportedCustomInput from '@/components/CustomInput';

// Schema
const schoolDetailsSchema = z.object({
  name: z.string().max(100, { message: "School name must not exceed 100 characters." }),
  id: z.string().max(50, { message: "School ID must not exceed 50 characters." }),
  street: z.string().max(100, { message: "Street must not exceed 100 characters." }),
  district: z.string().max(100, { message: "District must not exceed 100 characters." }),
  municipality: z.string().max(100, { message: "Municipality must not exceed 100 characters." }),
  province: z.string().max(100, { message: "Province must not exceed 100 characters." }),
  contactNumber: z.string().max(20, { message: "Contact number must not exceed 20 characters." }),
  email: z.string().email({ message: "Invalid email format." }),
  website: z.string().url({ message: "Must be a valid URL." }).optional(),
});

type SchoolFormData = z.infer<typeof schoolDetailsSchema>;

// Fixed CustomInput Component
const CustomInput = ({
  control,
  name,
  label,
  placeholder,
  inputStyle,
  labelStyle,
  optional = false
}: {
  control: any; 
  name: string;
  label: string;
  placeholder: string;
  inputStyle?: string;
  labelStyle?: string;
  optional?: boolean;
}) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState: { error } }) => (
      <div className="mb-4">
        <label className={labelStyle || "block text-sm font-medium mb-2"}>
          {label} {optional && <span className="text-gray-400 text-sm">(optional)</span>}
        </label>
        <input
          {...field}
          placeholder={placeholder}
          className={inputStyle || "w-full p-3 rounded-md border border-gray-200 bg-gray-50"}
          type={name === "email" ? "email" : "text"}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
      </div>
    )}
  />
);

// Fixed CustomSelect Component
const CustomSelect = ({
  control,
  name,
  label,
  options,
  selectStyle,
  labelStyle
}: {
  control: any;
  name: string;
  label: string;
  options: { [key: string]: string | number }[];
  selectStyle?: string;
  labelStyle?: string;
}) => (
  <Controller
    control={control}
    name={name}
    render={({ field, fieldState: { error } }) => (
      <div className="mb-4">
        <label className={labelStyle || "block text-sm font-medium mb-2"}>{label}</label>
        <select
          {...field}
          className={selectStyle || "w-full p-3 rounded-md border border-gray-200 bg-gray-50 appearance-none"}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option
              key={option[`${name}Id`]}
              value={option[name]}
            >
              {option[name]}
            </option>
          ))}
        </select>
        {error && <p className="text-red-500 text-xs mt-1">{error.message}</p>}
      </div>
    )}
  />
);

// Mock data
const provinces = [
  { provinceId: 1, province: 'Masbate' },
  { provinceId: 2, province: 'Cebu' },
];

const municipalities = [
  { municipalityId: 1, municipality: 'San Jacinto' },
  { municipalityId: 2, municipality: 'Cebu City' },
  { municipalityId: 3, municipality: 'San Jose' },
];

const districts = [
  { districtId: 1, district: 'San Jose District' },
  { districtId: 2, district: 'North District' },
  { districtId: 3, district: 'San Jacinto' },
];

const streets = [
  { streetId: 1, street: '123 Main Street' },
  { streetId: 2, street: 'Oak Street' },
  { streetId: 3, street: 'Masbate' },
];

export default function SchoolDetails() {
  const form = useForm<SchoolFormData>({
    resolver: zodResolver(schoolDetailsSchema),
    defaultValues: {
      name: '',
      id: '',
      street: '',
      district: '',
      municipality: '',
      province: '',
      contactNumber: '',
      email: '',
      website: '',
    },
  });

  const onSubmit = (data: SchoolFormData) => {
    console.log('School Details Submitted:', data);
  };

  return (
    <div className="bg-container-1 py-8 px-4">
      <div className="w-full max-w-6xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
              {/* Left card */}
              <div className="bg-white shadow-sm rounded-lg p-6">
                <div className="space-y-4">
                  <CustomInput
                    control={form.control}
                    name="name"
                    label="School Name"
                    placeholder="San Jacinto Elementary School"
                    inputStyle="w-full p-2 rounded-md border-2 border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-[13px]"
                    labelStyle="block text-sm font-semibold"
                  />

                  <CustomInput
                    control={form.control}
                    name="id"
                    label="School ID"
                    placeholder="312312312"
                    inputStyle="w-full p-2 rounded-md border-2 border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-[13px]"
                    labelStyle="block text-sm font-semibold"
                  />

                  <CustomInput
                    control={form.control}
                    name="contactNumber"
                    label="School Contact Number"
                    placeholder="09123456789"
                    inputStyle="w-full p-2 rounded-md border-2 border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-[13px]"
                    labelStyle="block text-sm font-semibold"
                  />
                  
                  <CustomInput
                    control={form.control}
                    name="email"
                    label="School Email"
                    placeholder="sanjacintoelem@gmail.com"
                    inputStyle="w-full p-2 rounded-md border-2 border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-[13px]"
                    labelStyle="block text-sm font-semibold"
                  />
                  
                  <CustomInput
                    control={form.control}
                    name="website"
                    label="School Website"
                    placeholder="https://sanJacintoElementary.ph"
                    inputStyle="w-full p-2 rounded-md border-2 border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-[13px]"
                    labelStyle="block text-sm font-semibold"
                    optional={true}
                  />
                </div>
              </div>
              
              {/* Right card */}
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-lg font-medium text-accent mb-4">Address</h2>
                <div className="space-y-4">
                  <CustomSelect
                    control={form.control}
                    name="province"
                    label="Province"
                    options={provinces}
                    selectStyle="w-full p-2 rounded-md border-2 border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-[13px]"
                    labelStyle="block text-sm font-semibold"
                  />
                  
                  <CustomSelect
                    control={form.control}
                    name="municipality"
                    label="Municipality"
                    options={municipalities}
                    selectStyle="w-full p-2 rounded-md border-2 border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-[13px]"
                    labelStyle="block text-sm font-semibold"
                  />
                  
                  <CustomSelect
                    control={form.control}
                    name="district"
                    label="District"
                    options={districts}
                    selectStyle="w-full p-2 rounded-md border-2 border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-[13px]"
                    labelStyle="block text-sm font-semibold"
                  />
                  
                  <CustomSelect
                    control={form.control}
                    name="street"
                    label="Street"
                    options={streets}
                    selectStyle="w-full p-2 rounded-md border-2 border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-[13px]"
                    labelStyle="block text-sm font-semibold"
                  />
                </div>
              </div>
            </div>
            
        {/* Submit Button */}
          <div className="col-span-2 mt-4 flex justify-center">
            <button
              type="submit"
              className="bg-accent  mt-2 py-2 px-6 rounded-[10px] font-semibold text-white transition duration-300 hover:bg-primary hover:text-background"
            >
              Save Changes
            </button>
          </div>

          </form>
        </Form>
      </div>
    </div>
  );
}