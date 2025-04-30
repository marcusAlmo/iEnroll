import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { stepOneSchema } from "../schema/StepOneSchema";
import { Form } from "@/components/ui/form";
import CustomDropdown from "@/components/CustomDropdown";
import { gradeLevels, levels, schools } from "../dropdownOptions";

const StepOne = () => {
  const form = useForm<z.infer<typeof stepOneSchema>>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      schoolName: "",
      level: "",
      gradeLevel: ""
    },
  });

  // Watch the "level" field to trigger re-renders when it changes
  const selectedLevel = useWatch({
    control: form.control,
    name: "level",
  });

  // Filter the available grade levels to be displayed in the dropdown according to the level selected
  const filteredGradeLevels = (level: string) => {
    if (level === "Elementary") {
      return gradeLevels.slice(1, 7);
    } else if (level === "Junior High School") {
      return gradeLevels.slice(7, 10);
    } else if (level === "Senior High School") {
      return gradeLevels.slice(11);
    }
    // Return empty array if no level is selected yet
    return [];
  };

  console.log("Selected Level:", selectedLevel); // Debugging

  const onSubmit = (data: z.infer<typeof stepOneSchema>) => {
    console.log(data);
  };

  return (
    <section className="flex flex-col items-center justify-center py-12">
      <div className="text-center space-y-1.5">
        <h1 className="text-accent font-semibold text-3xl">Simple lang</h1>
        <p className="text-text-2 text-sm font-semibold">Please fill the form to enroll</p>
      </div>

      <div className="mt-8 w-screen px-14">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CustomDropdown
              control={form.control}
              name="schoolName"
              values={schools}
              buttonClassName="w-full rounded-[10px] bg-background px-4 py-2 text-sm transition-all ease-in-out hover:text-secondary"
              menuClassName="w-full rounded-[10px] bg-white"
              itemClassName="rounded-[10px] pl-4 pr-36 py-2 transition-all ease-in-out"
              label="Choose School"
              labelClassName="text-sm text-text-2"
            />

            <CustomDropdown
              control={form.control}
              name="level"
              values={levels}
              buttonClassName="w-full rounded-[10px] bg-background px-4 py-2 text-sm transition-all ease-in-out hover:text-secondary"
              menuClassName="w-full rounded-[10px] bg-white"
              itemClassName="rounded-[10px] pl-4 pr-18 py-2 transition-all ease-in-out"
              label="Choose Level"
              labelClassName="text-sm text-text-2"
            />

            <CustomDropdown
              control={form.control}
              name="gradeLevel"
              values={filteredGradeLevels(selectedLevel)}
              buttonClassName="w-full rounded-[10px] bg-background px-4 py-2 text-sm transition-all ease-in-out hover:text-secondary"
              menuClassName="w-full rounded-[10px] bg-white"
              itemClassName="rounded-[10px] pl-4 pr-36 py-2 transition-all ease-in-out"
              label="Choose Grade Level"
              labelClassName="text-sm text-text-2"
            />
          </form>
        </Form>
      </div>
    </section>
  )
}

export default StepOne
