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
  address: z.string().max(255, { message: "Address must not exceed 255 characters." }),
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
      address: '',
      contactNumber: '',
      email: '',
      website: '',
    },
  });

  const onSubmit = (data: SchoolFormData) => {
    console.log('School Details Submitted:', data);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border-2 my-22 max-w-[800px] w-full mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-6">
          {/* Row 1 */}
          <CustomInput
            control={form.control}
            name="name"
            label="School Name"
            placeholder="San Jacinto Elementary School"
            inputStyle="w-full p-4  rounded-md border-2 border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-[13px]"
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

          {/* Row 2 */}
          <CustomInput
            control={form.control}
            name="address"
            label="School Address"
            placeholder="HP9P+P9R, San Jacinto, Masbate"
            inputStyle="w-full p-4 rounded-md border-2 border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-[13px]"
            labelStyle="block text-sm font-semibold"
          />

          {/* Row 3 */}
          <CustomInput
            control={form.control}
            name="website"
            label="School Website"
            placeholder="sanJacintoElementary.ph"
            inputStyle="w-full p-4 rounded-md border-2 border-text-2 bg-background focus:outline-none focus:ring-2 focus:ring-blue-300 placeholder:text-[13px]"
            labelStyle="block text-sm font-semibold"
          />

          {/* Submit Button */}
          <div className="col-span-2 mt-6 flex justify-center">
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
