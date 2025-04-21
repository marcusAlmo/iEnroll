import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from "@/components/ui/form";
import CustomInput from '@/components/CustomInput';

// Schema
const schoolDetailsSchema = z.object({
  name: z.string().max(100, { message: "School name must not exceed 100 characters." }),
  id: z.string().max(50, { message: "School ID must not exceed 50 characters." }),
  street: z.string().max(100, { message: "Street must not exceed 100 characters." }),
  district: z.string().max(100, { message: "District must not exceed 100 characters." }),
  municipality: z.string().max(100, { message: "Municipality must not exceed 100 characters." }),
  province: z.string().max(100, { message: "Province must not exceed 100 characters." }),
  address: z.string().max(200, { message: "Address must not exceed 200 characters." }),
  contactNumber: z.string().max(20, { message: "Contact number must not exceed 20 characters." }),
  email: z.string().email({ message: "Invalid email format." }),
  website: z.string().url({ message: "Must be a valid URL." }).optional(),
});

type SchoolFormData = z.infer<typeof schoolDetailsSchema>;

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
      address: '',
      contactNumber: '',
      email: '',
      website: '',
    },
  });

  const onSubmit = (data: SchoolFormData) => {
    const fullAddress = `${data.street}, ${data.district}, ${data.municipality}, ${data.province}`;
    
    // update the address field with the generated address
    form.setValue("address", fullAddress);
  
    console.log('Full Address:', fullAddress);
    console.log('School Details Submitted:', { ...data, address: fullAddress });
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-4 border-2 my-5 max-w-[900px] max-h-[100x]w-full mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
          {/* Column 1 */}
          <div className="flex flex-col gap-4">
            <CustomInput
              control={form.control}
              name="name"
              label="School Name"
              placeholder="San Jacinto Elementary School"
              inputStyle="w-full p-4 rounded-md border-2 border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-[13px]"
              labelStyle="block text-sm font-semibold"
            />
            <CustomInput
              control={form.control}
              name="contactNumber"
              label="School Contact Number"
              placeholder="09123456789"
              inputStyle="w-full p-4 rounded-md border-2 border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-[13px]"
              labelStyle="block text-sm font-semibold"
            />
            <CustomInput
              control={form.control}
              name="id"
              label="School ID"
              placeholder="312312312"
              inputStyle="w-full p-4 rounded-md border-2 border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-[13px]"
              labelStyle="block text-sm font-semibold"
            />
            <CustomInput
              control={form.control}
              name="email"
              label="School Email"
              placeholder="sanjacintoelem@gmail.com"
              inputStyle="w-full p-4 rounded-md border-2 border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-[13px]"
              labelStyle="block text-sm font-semibold"
            />
              <CustomInput
              control={form.control}
              name="website"
              label="School Website"
              placeholder="https://sanJacintoElementary.ph"
              inputStyle="w-full p-4 rounded-md border-2 border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-[13px]"
              labelStyle="block text-sm font-semibold"
            />
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-4">
            <CustomInput
              control={form.control}
              name="street"
              label="Street"
              placeholder="123 Main St."
              inputStyle="w-full p-4 rounded-md border-2 border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-[13px]"
              labelStyle="block text-sm font-semibold"
            />
            <CustomInput
              control={form.control}
              name="district"
              label="District"
              placeholder="San Jose District"
              inputStyle="w-full p-4 rounded-md border-2 border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-[13px]"
              labelStyle="block text-sm font-semibold"
            />
            <CustomInput
              control={form.control}
              name="municipality"
              label="Municipality"
              placeholder="San Jacinto"
              inputStyle="w-full p-4 rounded-md border-2 border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-[13px]"
              labelStyle="block text-sm font-semibold"
            />
            <CustomInput
              control={form.control}
              name="province"
              label="Province"
              placeholder="Masbate"
              inputStyle="w-full p-4 rounded-md border-2 border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-[13px]"
              labelStyle="block text-sm font-semibold"
            />
            <CustomInput
              control={form.control}
              name="address"
              label="School Address"
              placeholder="HP9P+P9R, San Jacinto, Masbate"
              inputStyle="w-full p-4 rounded-md border-2 border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-[13px]"
              labelStyle="block text-sm font-semibold"
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-2 mt-4 flex justify-center">
            <button
              type="submit"
              className="bg-accent py-2 px-6 rounded-[10px] font-semibold text-white transition duration-300 hover:bg-primary hover:text-background"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
