import { SchoolLevelAndScheduleReturn } from "../../types";

export const academicLevels: SchoolLevelAndScheduleReturn = [
  {
    name: "Primary Education",
    code: "PE",
    gradeLevels: [
      {
        name: "Grade 1",
        code: "G1",
        schedule: [
          {
            startDatetime: new Date("2025-06-03T08:00:00"),
            endDatetime: new Date("2025-06-03T10:00:00"),
            slotsLeft: 10,
          },
        ],
        note: "Introductory level for kids",
        gradeSectionType: [
          {
            id: 1,
            type: "Regular",
            sections: [
              { id: 1, name: "1-A", max_slot: 30 },
              { id: 2, name: "1-B", max_slot: 25 },
            ],
          },
        ],
      },
      {
        name: "Grade 2",
        code: "G2",
        schedule: null,
        gradeSectionType: [
          {
            id: 2,
            type: "SPED",
            sections: [{ id: 3, name: "SPED-A", max_slot: 10 }],
          },
        ],
      },
    ],
  },
  {
    name: "Junior High School",
    code: "JHS",
    gradeLevels: [
      {
        name: "Grade 7",
        code: "G7",
        schedule: [
          {
            startDatetime: new Date("2025-06-05T13:00:00"),
            endDatetime: new Date("2025-06-05T15:00:00"),
            slotsLeft: 5,
          },
        ],
        gradeSectionType: [
          {
            id: 3,
            type: "STEM",
            sections: [
              { id: 4, name: "7-STEM A", max_slot: 35 },
              { id: 5, name: "7-STEM B", max_slot: 30 },
            ],
          },
        ],
      },
      {
        name: "Grade 10",
        code: "G10",
        schedule: [
          {
            startDatetime: new Date("2025-06-06T09:00:00"),
            endDatetime: new Date("2025-06-06T11:00:00"),
            slotsLeft: null,
          },
        ],
        gradeSectionType: [
          {
            id: 4,
            type: "Arts & Design",
            sections: [{ id: 6, name: "10-AD A", max_slot: 20 }],
          },
        ],
      },
    ],
  },
  {
    name: "Senior High School",
    code: "SHS",
    gradeLevels: [
      {
        name: "Grade 11",
        code: "G11",
        schedule: [
          {
            startDatetime: new Date("2025-06-07T08:30:00"),
            endDatetime: new Date("2025-06-07T11:30:00"),
            slotsLeft: 12,
          },
        ],
        note: "Preparation for college courses",
        gradeSectionType: [
          {
            id: 5,
            type: "ABM",
            sections: [{ id: 7, name: "11-ABM A", max_slot: 30 }],
          },
          {
            id: 6,
            type: "HUMSS",
            sections: [
              { id: 8, name: "11-HUMSS A", max_slot: 25 },
              { id: 9, name: "11-HUMSS B", max_slot: 25 },
            ],
          },
        ],
      },
    ],
  },
  {
    name: "Tertiary Education",
    code: "TE",
    gradeLevels: [
      {
        name: "1st Year",
        code: "Y1",
        schedule: [
          {
            startDatetime: new Date("2025-08-01T10:00:00"),
            endDatetime: new Date("2025-08-01T12:00:00"),
            slotsLeft: 20,
          },
        ],
        gradeSectionType: [
          {
            id: 7,
            type: "BSIT",
            sections: [
              { id: 10, name: "BSIT-1A", max_slot: 40 },
              { id: 11, name: "BSIT-1B", max_slot: 40 },
            ],
          },
          {
            id: 8,
            type: "BSBA",
            sections: [{ id: 12, name: "BSBA-1A", max_slot: 35 }],
          },
        ],
      },
    ],
  },
];
