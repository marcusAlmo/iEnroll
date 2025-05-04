import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { stepOneSchema } from "../schema/StepOneSchema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import CustomDropdown from "@/components/CustomDropdown";
import { gradeLevels, levels, schools, sections } from "../dropdownOptions";
import { Calendar } from 'primereact/calendar';
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";


const StepOne = () => {
  const [displaySlots, setDisplaySlots] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSubmit, setShowSubmit] = useState<boolean>(false);

  // Example: allowed enrollment dates
  const allowedDates = [
    new Date(2025, 4, 5),  // May 5, 2025
    new Date(2025, 4, 10), // May 10, 2025
    new Date(2025, 4, 15), // May 15, 2025
  ];

  // Time and number of slots
  const timeAndSlots = useMemo(() => [
    {
      id: 1,
      date: new Date(2025, 4, 5),
      timeslots: [
        {
          timeslotId: 1,
          timeStart: "8:00 AM",
          timeEnd: "10:00 AM",
          slots: 100
        },
        {
          timeslotId: 2,
          timeStart: "1:00 PM",
          timeEnd: "4:00 PM",
          slots: 50
        }
      ]
    },
    {
      id: 2,
      date: new Date(2025, 4, 10),
      timeslots: [
        {
          timeslotId: 1,
          timeStart: "9:00 AM",
          timeEnd: "11:00 AM",
          slots: 80
        },
        {
          timeslotId: 2,
          timeStart: "2:00 PM",
          timeEnd: "5:00 PM",
          slots: 50
        }
      ]
    },
    {
      id: 3,
      date: new Date(2025, 4, 15),
      timeslots: [
        {
          timeslotId: 1,
          timeStart: "9:00 AM",
          timeEnd: "12:00 PM",
          slots: 75
        },
        {
          timeslotId: 2,
          timeStart: "1:00 PM",
          timeEnd: "3:00 PM",
          slots: 25
        }
      ]
    }
  ], []);

  // Generate all dates in the month and disable those not in allowedDates
  const generateDisabledDates = () => {
    const year = 2025;
    const month = 4; // May
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const allDates = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));

    return allDates.filter(
      d => !allowedDates.some(ad => ad.getDate() === d.getDate())
    );
  };

  const form = useForm<z.infer<typeof stepOneSchema>>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: {
      schoolName: "",
      level: "",
      gradeLevel: "",
      section: "",
      enrollmentDate: undefined,
      enrollmentTime: undefined
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

  // Check if level, grade level, and section are ALL changed
  useEffect(() => {
    const subscription = form.watch((value) => {
      const { level, gradeLevel, section } = value;
      if (level && gradeLevel && section) {
        setDisplaySlots(true); // Display available slots
      } else {
        setDisplaySlots(false); // Hide slots if any field is empty
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const enrollmentDate = useWatch({ control: form.control, name: "enrollmentDate" });
  const enrollmentTime = useWatch({ control: form.control, name: "enrollmentTime" });
  
  useEffect(() => {
    const isDateDirty = form.formState.dirtyFields.enrollmentDate;
    const isTimeDirty = form.formState.dirtyFields.enrollmentTime;
  
    if (isDateDirty && isTimeDirty) {
      console.log("Both fields are dirty:", isDateDirty, isTimeDirty);
      setShowSubmit(true);
    } else {
      setShowSubmit(false);
    }
  }, [enrollmentDate, enrollmentTime, form.formState.dirtyFields]);
  

  // Watch the selected enrollment date
  const selectedDate = useWatch({
    control: form.control,
    name: "enrollmentDate",
  });

  // Filter timeAndSlots based on the selected date
  const filteredTimeAndSlots = useMemo(() => {
    if (!selectedDate) return [];
    return timeAndSlots.filter(
      (slot) =>
        slot.date.getDate() === selectedDate.getDate() &&
        slot.date.getMonth() === selectedDate.getMonth() &&
        slot.date.getFullYear() === selectedDate.getFullYear()
    );
  }, [selectedDate, timeAndSlots]);

  const onSubmit = (data: z.infer<typeof stepOneSchema>) => {
    console.log(data);
  };

  return (
    <section className="flex flex-col items-center justify-center py-12">
      <div className="text-center space-y-1.5">
        <h1 className="text-accent font-semibold text-3xl">Simple lang</h1>
        <p className="text-text-2 text-sm font-semibold">Please fill the form to enroll</p>
      </div>

      <div className="mt-8 w-screen">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="px-14 space-y-6">
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
              <CustomDropdown
                control={form.control}
                name="section"
                values={sections}
                buttonClassName="w-full rounded-[10px] bg-background px-4 py-2 text-sm transition-all ease-in-out hover:text-secondary"
                menuClassName="w-full rounded-[10px] bg-white"
                itemClassName="rounded-[10px] pl-4 pr-36 py-2 transition-all ease-in-out"
                label="Choose Section"
                labelClassName="text-sm text-text-2"
              />
            </div>
            
            {displaySlots && (
              <div className="flex flex-col gap-y-2 mt-6 items-center px-3">
                <FormField
                  control={form.control}
                  name="enrollmentDate"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="flex flex-col items-center text-text-2 my-4">
                        <>
                          <div>Please choose your desired enrollment date</div>
                          <div className="font-normal italic">Dates in green are the available dates</div>
                        </>
                      </FormLabel>
                      <FormControl>
                        <Calendar
                          value={field.value ? new Date(field.value) : null}
                          onChange={(e) => {
                            field.onChange(e.value);
                            form.setValue("enrollmentTime", undefined); // reset timeslot
                          }}
                          disabledDates={generateDisabledDates()}
                          dateTemplate={(date) => {
                            const isAllowed = allowedDates.some(ad =>
                              ad.getDate() === date.day &&
                              ad.getMonth() === date.month &&
                              ad.getFullYear() === date.year
                            );

                            const selected = field.value ? new Date(field.value) : null;
                            const isSelected =
                              selected &&
                              selected.getDate() === date.day &&
                              selected.getMonth() === date.month &&
                              selected.getFullYear() === date.year;

                            return (
                              <div
                                className={`
                                  w-8 h-8 flex items-center justify-center rounded-full
                                  ${isSelected ? 'bg-primary text-white' : ''}
                                  ${isAllowed && !isSelected ? 'bg-success text-background font-semibold' : ''}
                                `}
                              >
                                {date.day}
                              </div>
                            );
                          }}
                          inline
                          pt={{
                            root: {
                              className: `${fieldState?.error ? "border-red-500" : "border-container-2"}`
                            },
                            panel: { className: "bg-background p-3 rounded-[10px] border" },
                            input: { className: `text-sm ${fieldState?.error ? "text-red-500" : ""}` },
                            day: { className: "p-2 text-text-2 font-normal" },
                            month: { className: "p-2" },
                            year: { className: "p-2" },
                            previousButton: { className: "hidden" },
                            nextButton: { className: "hidden" }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="px-14 justify-center flex flex-row gap-4 flex-wrap">
                <FormField
                  control={form.control}
                  name="enrollmentTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex flex-col items-center text-text-2 my-4">
                        Choose your desired time
                      </FormLabel>
                      <FormControl>    
                        <div>
                          {filteredTimeAndSlots.map((slot) => (
                            <div key={slot.id} className="space-y-4">
                              {slot.timeslots.map((timeslot) => (
                                <div
                                  key={timeslot.timeslotId}
                                  className={`
                                    ${form.watch("enrollmentTime") === timeslot.timeslotId ? "bg-success text-background" : "text-text-2"}
                                    p-4 border rounded-lg shadow-sm flex flex-col items-center
                                  `}
                                  onClick={() => {field.onChange(timeslot.timeslotId); console.log("timeslot selected: ", timeslot.timeslotId)}}
                                >
                                  <div className="font-semibold">
                                    {timeslot.timeStart} - {timeslot.timeEnd}
                                  </div>
                                  <div className="text-sm">
                                    Slots Available: {timeslot.slots}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
              </div>
            )}

            {showSubmit && (
              <div className="mx-14 my-12">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full font-semibold text-background py-6 rounded-[10px] bg-accent`}
                >
                  {isLoading ? "Submitting" : "Enroll Now"}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </section>
  )
}

export default StepOne
