import React, { useState } from "react";

export default function SchoolForm() {
  const [schoolType, setSchoolType] = useState("");

  const handleSchoolTypeChange = (value: string) => {
    setSchoolType((prev) => (prev === value ? "" : value));
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border-2 my-21 max-w-[800px] w-full mx-auto">
    <div >

      {/* School Type and Academic Levels */}
      <div className="grid grid-cols-2 gap-0 text-sm">
        {/* School Type (Checkbox behaving like radio) */}
        <div>
          <h2 className="font-semibold mb-2  text-sm">School Type</h2>
          <div className="space-y-2  text-text-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={schoolType === "public"}
                onChange={() => handleSchoolTypeChange("public")}
              />
              Public
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={schoolType === "private"}
                onChange={() => handleSchoolTypeChange("private")}
              />
              Private
            </label>
          </div>
        </div>

        {/* Academic Levels (Checkboxes) */}
        <div>
          <h2 className="font-semibold mb-2  text-sm">Academic Levels</h2>
          <div className="grid grid-cols-2 gap-0 space-y-2  text-text-2">
            <label className="flex items-center gap-2 col-span-1">
              <input type="checkbox" />
              Kindergarten
            </label>
            <label className="flex items-center gap-2 col-span-1">
              <input type="checkbox" />
              Senior High School
            </label>
            <label className="flex items-center gap-2 col-span-2">
              <input type="checkbox" />
              Elementary
            </label>
            <label className="flex items-center gap-2 col-span-2">
              <input type="checkbox" />
              Junior High School
            </label>
          </div>
        </div>
      </div>

      <hr className="my-4 border-gray-500" />

      {/* Select Offered Grade Levels */}
      <div className="text-sm">
        <h2 className="font-semibold mb-4 text-sm">Select Offered Grade Levels</h2>
        <div className="grid grid-cols-5 gap-4  text-text-2">
          {/* Row 1 */}
          {["Nursery", "Grade 1", "Grade 4", "Grade 7", "Grade 10"].map((label) => (
            <label key={label} className="flex items-center gap-2">
              <input type="checkbox" />
              {label}
            </label>
          ))}

          {/* Row 2 */}
          {["Kinder", "Grade 2", "Grade 5", "Grade 8", "Grade 11"].map((label) => (
            <label key={label} className="flex items-center gap-2">
              <input type="checkbox" />
              {label}
            </label>
          ))}

          {/* Row 3 */}
          {["Preparatory", "Grade 3", "Grade 6", "Grade 9", "Grade 12"].map((label) => (
            <label key={label} className="flex items-center gap-2">
              <input type="checkbox" />
              {label}
            </label>
          ))}
        </div>
      </div>

      <hr className="my-4 border-gray-500" />

      {/* Save Button */}
      <div className="flex justify-start">
        <button
            type="submit"
            className="bg-accent py-2 px-6 rounded-[10px] font-semibold text-white transition duration-300 hover:bg-primary hover:text-background"
            >
              Save Changes
          </button>
      </div>
    </div>
    </div>
  );
}
