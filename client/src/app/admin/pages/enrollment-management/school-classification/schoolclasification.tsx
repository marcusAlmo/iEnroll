import { requestData } from "@/lib/dataRequester";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface GradeAcadLevels {
  schoolType: string;
  academicLevels: {
    name: string;
    checked: boolean;
  }[];
  gradeLevels: {
    name: string;
    checked: boolean;
  }[];
};

export default function SchoolForm() {
  const [schoolType, setSchoolType] = useState("");
  const [academicLevels, setAcademicLevels] = useState<GradeAcadLevels['academicLevels']>([]);
  const [gradeLevels, setGradeLevels] = useState<GradeAcadLevels['gradeLevels']>([]);

  const fetchGradeLevels = async () => {
    try {
      const data = await requestData<GradeAcadLevels>({
        url: 'http://localhost:3000/api/school-classification/retrieve-all-grade-levels',
        method: 'GET'
      });

      if (data) {
        setAcademicLevels(data.academicLevels);
        setGradeLevels(data.gradeLevels);
        setSchoolType(data.schoolType);
      }
    } catch(err) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error('An error has occurred');
      console.log(err);
    }
  };

  useEffect(() => {
    fetchGradeLevels();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const retrievedGradeLevels = {
      schoolType,
      academicLevels,
      gradeLevels
    };
    console.log(retrievedGradeLevels);
  };

  // Update academic level checked status
  const handleAcademicLevelChange = (name: string, isChecked: boolean) => {
    setAcademicLevels(prevLevels =>
      prevLevels.map(level =>
        level.name === name ? { ...level, checked: isChecked } : level
      )
    );
  };

  // Update grade level checked status
  const handleGradeLevelChange = (name: string, isChecked: boolean) => {
    setGradeLevels(prevLevels =>
      prevLevels.map(level =>
        level.name === name ? { ...level, checked: isChecked } : level
      )
    );
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 border-2 my-21 max-w-[800px] w-full mx-auto">
      <form onSubmit={handleSubmit}>
        {/* School Type and Academic Levels */}
        <div className="grid grid-cols-2 gap-0 text-sm">
          {/* School Type */}
          <div>
            <h2 className="font-semibold mb-2 text-sm">School Type</h2>
            <div className="space-y-2 text-text-2">
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

          {/* Academic Levels */}
          <div>
            <h2 className="font-semibold mb-2 text-sm">Academic Levels</h2>
            <div className="grid grid-cols-2 gap-0 space-y-2 text-text-2">
              {academicLevels.map((level) => (
                <label key={level.name} className="flex items-center gap-2 col-span-1">
                  <input
                    type="checkbox"
                    checked={level.checked}
                    onChange={(e) => handleAcademicLevelChange(level.name, e.target.checked)}
                  />
                  {level.name}
                </label>
              ))}
            </div>
          </div>
        </div>

        <hr className="my-4 border-gray-500" />

        {/* Grade Levels */}
        <div className="text-sm">
          <h2 className="font-semibold mb-4 text-sm">Select Offered Grade Levels</h2>
          <div className="grid grid-cols-5 gap-4 text-text-2">
            {gradeLevels.map((level) => (
              <label key={level.name} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={level.checked}
                  onChange={(e) => handleGradeLevelChange(level.name, e.target.checked)}
                />
                {level.name}
              </label>
            ))}
          </div>
        </div>

        <hr className="my-4 border-gray-500" />

        <div className="flex justify-start">
          <button
            type="submit"
            className="bg-accent py-2 px-6 rounded-[10px] font-semibold text-white transition duration-300 hover:bg-primary hover:text-background"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}