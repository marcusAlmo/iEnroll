import { useWatch } from "react-hook-form";
import { z } from "zod";

import { format } from "date-fns";

import { stepOneSchema } from "../schema/StepOneSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CustomDropdown from "@/components/CustomDropdown";
// import { gradeLevels, levels, schools, sections } from "../dropdownOptions";
import { Calendar } from "primereact/calendar";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Schedule } from "@/services/mobile-web-app/enrollment/step-one/types";
import { useEnroll } from "../../context/enroll/hook";
import { useNavigate } from "react-router";

const StepOne = () => {
  const {
    showSubmitStep1: showSubmit,
    setShowSubmitStep1: setShowSubmit,
    levels,
    gradeLevels,
    programs,
    sections,
    schedules,
    stepOneForm: form,
    setCurrentStep,
    setIsStepOneFinished,
    canChooseSection,
    setEnrollmentDetailsPayload,
  } = useEnroll();

  useEffect(() => {
    setCurrentStep(1);
  }, [setCurrentStep]);

  const navigate = useNavigate();
  const [displaySlots, setDisplaySlots] = useState<boolean>(false);
  // const [isLoading, setIsLoading] = useState<boolean>(false);

  const normalizeDate = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const { allowedDates, timeAndSlots } = useMemo(() => {
    if (!schedules) return { allowedDates: [], timeAndSlots: [] };

    // Step 1: Group schedules by date
    const groupedByDate = new Map<string, Schedule[]>();

    schedules.forEach((schedule) => {
      const key = normalizeDate(new Date(schedule.dateStart)).toISOString(); // e.g., '2025-05-05T00:00:00.000Z'
      if (!groupedByDate.has(key)) {
        groupedByDate.set(key, []);
      }
      groupedByDate.get(key)!.push(schedule);
    });

    // Step 2: Build allowedDates array
    const allowedDates = Array.from(groupedByDate.keys()).map(
      (key) => new Date(key),
    );

    // Step 3: Build timeAndSlots array
    const timeAndSlots = Array.from(groupedByDate.entries()).map(
      ([dateKey, schedules], dateIndex) => ({
        id: dateIndex + 1,
        date: new Date(dateKey),
        timeslots: schedules.map((sched, timeslotIndex) => ({
          scheduleId: sched.scheduleId,
          timeslotId: timeslotIndex + 1,
          timeStart: format(sched.dateStart, "h:mm a"),
          timeEnd: format(sched.dateEnd, "h:mm a"),
          slots: sched.slotsLeft ?? 0,
        })),
      }),
    );

    return { allowedDates, timeAndSlots };
  }, [schedules]);

  // Generate all dates in the month and disable those not in allowedDates
  const generateDisabledDates = (allowedDates: Date[]): Date[] => {
    if (!allowedDates || allowedDates.length === 0) return [];

    // Step 1: Find the date range
    const sortedDates = [...allowedDates].sort(
      (a, b) => a.getTime() - b.getTime(),
    );
    const startDate = new Date(
      sortedDates[0].getFullYear(),
      sortedDates[0].getMonth(),
      1,
    );
    const endDate = new Date(
      sortedDates[sortedDates.length - 1].getFullYear(),
      sortedDates[sortedDates.length - 1].getMonth() + 1,
      0,
    );

    // Step 2: Generate all dates in the month range
    const allDates: Date[] = [];
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      allDates.push(new Date(d)); // Copy the date
    }

    // Step 3: Filter out allowed dates
    const disabledDates = allDates.filter(
      (d) =>
        !allowedDates.some(
          (ad) =>
            ad.getFullYear() === d.getFullYear() &&
            ad.getMonth() === d.getMonth() &&
            ad.getDate() === d.getDate(),
        ),
    );

    return disabledDates;
  };

  const disabledDates = useMemo(
    () => generateDisabledDates(allowedDates),
    [allowedDates],
  );

  // Check if level, grade level, and section are ALL changed
  useEffect(() => {
    const subscription = form.watch((value) => {
      const {
        levelCode: level,
        gradeLevelCode: gradeLevel,
        programId: program,
        sectionId: section,
      } = value;
      if (level && gradeLevel && program && (!canChooseSection || section)) {
        setDisplaySlots(true); // Display available slots
      } else {
        setDisplaySlots(false); // Hide slots if any field is empty
      }
    });

    return () => subscription.unsubscribe();
  }, [canChooseSection, form]);

  const enrollmentDate = useWatch({
    control: form.control,
    name: "enrollmentDate",
  });
  const scheduleId = useWatch({
    control: form.control,
    name: "scheduleId",
  });

  useEffect(() => {
    const isDateDirty = form.formState.dirtyFields.enrollmentDate;
    const isTimeDirty = form.formState.dirtyFields.scheduleId;
    const isSectionDirty =
      !canChooseSection || form.formState.dirtyFields.sectionId;
    const isProgramDirty = form.formState.dirtyFields.programId;
    const isGradeLevelDirty = form.formState.dirtyFields.gradeLevelCode;
    const isLevelDirty = form.formState.dirtyFields.levelCode;

    // console.log("---------------");

    // console.log("IS_DATE_DIRTY", isDateDirty);
    // console.log("IS_TIME_DIRTY", isTimeDirty);
    // console.log("IS_SECTION_DIRTY", isSectionDirty);
    // console.log("IS_PROGRAM_DIRTY", isProgramDirty);
    // console.log("IS_GRADE_LEVEL_DIRTY", isGradeLevelDirty);
    // console.log("IS_LEVEL_DIRTY", isLevelDirty);

    if (
      isDateDirty &&
      isTimeDirty &&
      isSectionDirty &&
      isProgramDirty &&
      isGradeLevelDirty &&
      isLevelDirty
    ) {
      setShowSubmit(true);
    } else {
      setShowSubmit(false);
    }
  }, [
    canChooseSection,
    enrollmentDate,
    scheduleId,
    form.formState.dirtyFields,
    setShowSubmit,
  ]);

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
        slot.date.getFullYear() === selectedDate.getFullYear(),
    );
  }, [selectedDate, timeAndSlots]);

  const onSubmit = useCallback(
    (data: z.infer<typeof stepOneSchema>) => {
      console.log("SUBMITTING FORM", data);

      setEnrollmentDetailsPayload({
        gradeSectionProgramId: +data.programId,
        scheduleId: +data.scheduleId,
        gradeSectionId: data.sectionId ? +data.sectionId : undefined,
      });
      setIsStepOneFinished(true);
      navigate("/student/enroll/step-2");
    },
    [navigate, setEnrollmentDetailsPayload, setIsStepOneFinished],
  );

  // const sortedAllowedDates = [...allowedDates].sort(
  //   (a, b) => a.getTime() - b.getTime(),
  // );

  // const minDate = sortedAllowedDates[0];
  // const maxDate = sortedAllowedDates[sortedAllowedDates.length - 1];

  return (
    <section className="flex flex-col items-center justify-center py-12">
      <div className="space-y-1.5 text-center">
        <h1 className="text-accent text-3xl font-semibold">Simple lang</h1>
        <p className="text-text-2 text-sm font-semibold">
          Please fill the form to enroll
        </p>
      </div>

      <div className="mt-8 w-screen">
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // console.log("Raw submit triggered");
              // console.log("Form values:", form.getValues());
              // console.log("Form errors:", form.formState.errors);
              form.handleSubmit(onSubmit)(e);
            }}
          >
            <div className="space-y-6 px-14">
              {levels && (
                <CustomDropdown
                  control={form.control}
                  name="levelCode"
                  values={levels}
                  buttonClassName="w-full rounded-[10px] bg-background px-4 py-2 text-sm transition-all ease-in-out hover:text-secondary"
                  menuClassName="w-full rounded-[10px] bg-white"
                  itemClassName="rounded-[10px] pl-4 pr-18 py-2 transition-all ease-in-out"
                  label="Choose Level"
                  labelClassName="text-sm text-text-2"
                />
              )}
              {gradeLevels && (
                <CustomDropdown
                  control={form.control}
                  name="gradeLevelCode"
                  values={gradeLevels}
                  buttonClassName="w-full rounded-[10px] bg-background px-4 py-2 text-sm transition-all ease-in-out hover:text-secondary"
                  menuClassName="w-full rounded-[10px] bg-white"
                  itemClassName="rounded-[10px] pl-4 pr-36 py-2 transition-all ease-in-out"
                  label="Choose Grade Level"
                  labelClassName="text-sm text-text-2"
                />
              )}
              {programs && (
                <CustomDropdown
                  control={form.control}
                  name="programId"
                  values={programs}
                  buttonClassName="w-full rounded-[10px] bg-background px-4 py-2 text-sm transition-all ease-in-out hover:text-secondary"
                  menuClassName="w-full rounded-[10px] bg-white"
                  itemClassName="rounded-[10px] pl-4 pr-36 py-2 transition-all ease-in-out"
                  label="Choose Program"
                  labelClassName="text-sm text-text-2"
                />
              )}
              {sections && (
                <CustomDropdown
                  control={form.control}
                  name="sectionId"
                  values={sections}
                  buttonClassName="w-full rounded-[10px] bg-background px-4 py-2 text-sm transition-all ease-in-out hover:text-secondary"
                  menuClassName="w-full rounded-[10px] bg-white"
                  itemClassName="rounded-[10px] pl-4 pr-36 py-2 transition-all ease-in-out"
                  label="Choose Section"
                  labelClassName="text-sm text-text-2"
                />
              )}
            </div>

            {displaySlots && (
              <div className="mt-6 flex flex-col items-center gap-y-2 px-3">
                <FormField
                  control={form.control}
                  name="enrollmentDate"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-text-2 my-4 flex flex-col items-center">
                        <>
                          <div>Please choose your desired enrollment date</div>
                          <div className="font-normal italic">
                            Dates in green are the available dates
                          </div>
                        </>
                      </FormLabel>
                      <FormControl>
                        <Calendar
                          value={field.value ? new Date(field.value) : null}
                          onChange={(e) => {
                            field.onChange(e.value);
                            // @ts-expect-error allow undefined
                            form.setValue("scheduleId", undefined); // reset schedule id
                          }}
                          disabledDates={disabledDates}
                          dateTemplate={(date) => {
                            const isAllowed = allowedDates.some(
                              (ad) =>
                                ad.getDate() === date.day &&
                                ad.getMonth() === date.month &&
                                ad.getFullYear() === date.year,
                            );

                            const selected = field.value
                              ? new Date(field.value)
                              : null;
                            const isSelected =
                              selected &&
                              selected.getDate() === date.day &&
                              selected.getMonth() === date.month &&
                              selected.getFullYear() === date.year;

                            return (
                              <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full ${isSelected ? "bg-primary text-white" : ""} ${isAllowed && !isSelected ? "bg-success text-background font-semibold" : ""} `}
                              >
                                {date.day}
                              </div>
                            );
                          }}
                          inline
                          pt={{
                            root: {
                              className: `${fieldState?.error ? "border-red-500" : "border-container-2"}`,
                            },
                            panel: {
                              className:
                                "bg-background p-3 rounded-[10px] border",
                            },
                            input: {
                              className: `text-sm ${fieldState?.error ? "text-red-500" : ""}`,
                            },
                            day: { className: "p-2 text-text-2 font-normal" },
                            month: { className: "p-2" },
                            year: { className: "p-2" },
                            previousButton: { className: "hidden" },
                            nextButton: { className: "hidden" },
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-row flex-wrap justify-center gap-4 px-14">
                  <FormField
                    control={form.control}
                    name="scheduleId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-text-2 my-4 flex flex-col items-center">
                          Choose your desired time
                        </FormLabel>
                        <FormControl>
                          <div>
                            {filteredTimeAndSlots.map((slot) => (
                              <div key={slot.id} className="space-y-4">
                                {slot.timeslots.map((timeslot) => {
                                  const selectedTimeScheduleId =
                                    form.watch("scheduleId");
                                  const isSelected =
                                    +selectedTimeScheduleId ===
                                    timeslot.scheduleId;
                                  const isDisabled = timeslot.slots === 0;

                                  return (
                                    <div key={timeslot.timeslotId}>
                                      <div
                                        className={`flex flex-col items-center rounded-lg border p-4 shadow-sm ${isSelected ? "bg-success text-background" : "text-text-2"} ${isDisabled ? "cursor-not-allowed opacity-50" : "hover:bg-primary/10 cursor-pointer"} `}
                                        onClick={() => {
                                          if (isDisabled) return;
                                          field.onChange(
                                            timeslot.scheduleId.toString(),
                                          );
                                        }}
                                      >
                                        <div className="font-semibold">
                                          {timeslot.timeStart} -{" "}
                                          {timeslot.timeEnd}
                                        </div>
                                        <div className="text-sm">
                                          Slots Available: {timeslot.slots}
                                        </div>
                                      </div>

                                      {/* ❗ Warning if selected timeslot has 0 slots */}
                                      {
                                        // timeslot.slots === 0 && (
                                        //   <p className="mt-1 w-full text-center text-sm text-red-500">
                                        //     ⚠️ The selected time has no available
                                        //     slots.
                                        //   </p>
                                        // )
                                      }
                                    </div>
                                  );
                                })}
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
                {/* <Button
                  type="submit"
                  disabled={isLoading}
                  className={`text-background bg-accent w-full rounded-[10px] py-6 font-semibold`}
                >
                  {isLoading ? "Submitting" : "Enroll Now"}
                </Button> */}
                <Button
                  type="submit"
                  className={`text-background bg-accent w-full rounded-[10px] py-6 font-semibold`}
                >
                  Enroll Now
                </Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </section>
  );
};

export default StepOne;
