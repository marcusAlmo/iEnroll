import Enums from "@/services/common/types/enums";
import { Requirement, Student, Section, GradeLevel } from "../../types";

interface Stu extends Student {
  requirements: Requirement[];
}

interface Sec extends Section {
  students: Stu[];
}

interface Gra extends GradeLevel {
  sections: Sec[];
  unassigned: Stu[];
}

export const data: Gra[] = [
  {
    gradeId: 4,
    gradeName: "Grade 1",
    sections: [
      {
        sectionId: 1,
        sectionName: "Section A",
        students: [
          {
            studentId: 1001,
            firstName: "Paolo Benigno",
            middleName: "Aguirre",
            lastName: "Aquino",
            suffix: "IV",
            enrollmentStatus: Enums.application_status.pending,
            requirements: [
              {
                applicationId: 1,
                requirementId: 1,
                requirementName: "Birth Certificate",
                requirementType: Enums.attachment_type.image,
                requirementStatus: Enums.attachment_status.pending,
                fileUrl:
                  "https://imgv2-1-f.scribdassets.com/img/document/471922303/original/280703d8e2/1?v=1",
                fileName: "birth_certificate.jpg",
                userInput: null,
                remarks: null,
              },
              {
                applicationId: 1,
                requirementId: 2,
                requirementName: "Report Card",
                requirementType: Enums.attachment_type.image,
                requirementStatus: Enums.attachment_status.pending,
                fileUrl:
                  "https://imgv2-2-f.scribdassets.com/img/document/508555750/original/dd51abd099/1?v=1",
                fileName: "report_card.jpg",
                userInput: null,
                remarks: null,
              },
            ],
          },
          {
            studentId: 1002,
            firstName: "Francis Pancratius",
            middleName: "Nepomuceno",
            lastName: "Pangilinan",
            suffix: null,
            enrollmentStatus: Enums.application_status.pending,
            requirements: [
              {
                applicationId: 2,
                requirementId: 1,
                requirementName: "Birth Certificate",
                requirementType: Enums.attachment_type.image,
                requirementStatus: Enums.attachment_status.pending,
                fileUrl:
                  "https://imgv2-1-f.scribdassets.com/img/document/471922303/original/280703d8e2/1?v=1",
                fileName: "birth_certificate.jpg",
                userInput: null,
                remarks: null,
              },
              {
                applicationId: 2,
                requirementId: 2,
                requirementName: "Good Moral Certificate",
                requirementType: Enums.attachment_type.image,
                requirementStatus: Enums.attachment_status.pending,
                fileUrl:
                  "https://imgv2-1-f.scribdassets.com/img/document/413678275/original/1aafbd1eaa/1?v=1",
                fileName: "good_moral_certificate.jpg",
                userInput: null,
                remarks: null,
              },
            ],
          },
        ],
      },
      {
        sectionId: 2,
        sectionName: "Section B",
        students: [
          {
            studentId: 1003,
            firstName: "Heidi",
            middleName: "Reyes",
            lastName: "Lloce",
            suffix: null,
            enrollmentStatus: Enums.application_status.pending,
            requirements: [
              {
                applicationId: 3,
                requirementId: 1,
                requirementName: "Birth Certificate",
                requirementType: Enums.attachment_type.image,
                requirementStatus: Enums.attachment_status.pending,
                fileUrl:
                  "https://imgv2-1-f.scribdassets.com/img/document/471922303/original/280703d8e2/1?v=1",
                fileName: "birth_certificate.jpg",
                userInput: null,
                remarks: null,
              },
              {
                applicationId: 3,
                requirementId: 2,
                requirementName: "Good Moral",
                requirementType: Enums.attachment_type.image,
                requirementStatus: Enums.attachment_status.pending,
                fileUrl:
                  "https://imgv2-1-f.scribdassets.com/img/document/413678275/original/1aafbd1eaa/1?v=1",
                fileName: "goodmoral.jpg",
                userInput: null,
                remarks: null,
              },
            ],
          },
          {
            studentId: 1004,
            firstName: "Ana Theresia",
            middleName: "Navarro",
            lastName: "Hontiveros",
            suffix: null,
            enrollmentStatus: Enums.application_status.pending,
            requirements: [
              {
                applicationId: 4,
                requirementId: 1,
                requirementName: "Birth Certificate",
                requirementType: Enums.attachment_type.image,
                requirementStatus: Enums.attachment_status.pending,
                fileUrl:
                  "https://imgv2-1-f.scribdassets.com/img/document/471922303/original/280703d8e2/1?v=1",
                fileName: "birth_certificate.jpg",
                userInput: null,
                remarks: null,
              },
              {
                applicationId: 4,
                requirementId: 2,
                requirementName: "Good Moral",
                requirementType: Enums.attachment_type.image,
                requirementStatus: Enums.attachment_status.pending,
                fileUrl:
                  "https://imgv2-1-f.scribdassets.com/img/document/413678275/original/1aafbd1eaa/1?v=1",
                fileName: "goodmoral.jpg",
                userInput: null,
                remarks: null,
              },
              {
                applicationId: 4,
                requirementId: 3,
                requirementName: "Mother's Name",
                requirementType: Enums.attachment_type.text,
                requirementStatus: Enums.attachment_status.pending,
                fileUrl: null,
                fileName: null,
                userInput: "Maria Leonor Gerona Robredo",
                remarks: null,
              },
            ],
          },
        ],
      },
      {
        sectionId: 3,
        sectionName: "Section C",
        students: [
          {
            studentId: 1006,
            firstName: "Mark June",
            middleName: null,
            lastName: "Almojuela",
            suffix: null,
            enrollmentStatus: Enums.application_status.accepted,
            requirements: [
              {
                applicationId: 6,
                requirementId: 1,
                requirementName: "Birth Certificate",
                requirementType: Enums.attachment_type.image,
                requirementStatus: Enums.attachment_status.accepted,
                fileUrl:
                  "https://imgv2-1-f.scribdassets.com/img/document/471922303/original/280703d8e2/1?v=1",
                fileName: "birth_certificate.jpg",
                userInput: null,
                remarks: null,
              },
              {
                applicationId: 6,
                requirementId: 2,
                requirementName: "Good Moral",
                requirementType: Enums.attachment_type.image,
                requirementStatus: Enums.attachment_status.accepted,
                fileUrl:
                  "https://imgv2-1-f.scribdassets.com/img/document/413678275/original/1aafbd1eaa/1?v=1",
                fileName: "goodmoral.jpg",
                userInput: null,
                remarks: null,
              },
            ],
          },
        ],
      },
    ],
    unassigned: [
      {
        studentId: 1005,
        firstName: "Maria Leonor",
        middleName: "Gerona",
        lastName: "Robredo",
        suffix: null,
        enrollmentStatus: Enums.application_status.pending,
        requirements: [
          {
            applicationId: 5,
            requirementId: 1,
            requirementName: "Birth Certificate",
            requirementType: Enums.attachment_type.image,
            requirementStatus: Enums.attachment_status.pending,
            fileUrl:
              "https://imgv2-1-f.scribdassets.com/img/document/471922303/original/280703d8e2/1?v=1",
            fileName: "birth_certificate.jpg",
            userInput: null,
            remarks: null,
          },
          {
            applicationId: 5,
            requirementId: 2,
            requirementName: "Good Moral Certificate",
            requirementType: Enums.attachment_type.image,
            requirementStatus: Enums.attachment_status.pending,
            fileUrl:
              "https://imgv2-1-f.scribdassets.com/img/document/413678275/original/1aafbd1eaa/1?v=1",
            fileName: "good_moral_certificate.jpg",
            userInput: null,
            remarks: null,
          },
        ],
      },
    ],
  },
];
