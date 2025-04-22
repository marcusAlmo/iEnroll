export const sampleDeniedStudents = [
  {
    studentId: 1001,
    studentName: "John Doe",
    firstName: "John",
    middleName: "Robert",
    lastName: "Doe",
    applicationStatus: "Denied",
    denialDate: "2024-03-15",
    reviewedBy: "Dr. Smith",
    requirements: [
      {
        requirementName: "Birth Certificate",
        requirementStatus: false,
        requirementType: "document",
        denialReason: "Document is unclear and needs to be resubmitted"
      },
      {
        requirementName: "Academic Records",
        requirementStatus: false,
        requirementType: "document",
        denialReason: "Missing previous semester grades"
      },
      {
        requirementName: "Recommendation Letter",
        requirementStatus: true,
        requirementType: "document",
        imageUrl: "https://example.com/recommendation.pdf"
      },
      {
        requirementName: "Personal Statement",
        requirementStatus: false,
        requirementType: "text",
        userInput: "I want to study...",
        denialReason: "Statement is too brief and lacks detail"
      }
    ]
  },
  {
    studentId: 1002,
    studentName: "Maria Garcia",
    firstName: "Maria",
    middleName: "Isabel",
    lastName: "Garcia",
    applicationStatus: "Denied",
    denialDate: "2024-03-14",
    reviewedBy: "Prof. Johnson",
    requirements: [
      {
        requirementName: "High School Diploma",
        requirementStatus: false,
        requirementType: "document",
        denialReason: "Diploma not yet received from previous school"
      },
      {
        requirementName: "Medical Certificate",
        requirementStatus: true,
        requirementType: "document",
        imageUrl: "https://example.com/medical.pdf"
      },
      {
        requirementName: "Essay",
        requirementStatus: false,
        requirementType: "text",
        userInput: "My academic goals...",
        denialReason: "Essay does not meet minimum word count requirement"
      }
    ]
  },
  {
    studentId: 1003,
    studentName: "James Wilson",
    firstName: "James",
    middleName: "Edward",
    lastName: "Wilson",
    applicationStatus: "Denied",
    denialDate: "2024-03-13",
    reviewedBy: "Dr. Brown",
    requirements: [
      {
        requirementName: "Valid ID",
        requirementStatus: false,
        requirementType: "document",
        denialReason: "ID has expired"
      },
      {
        requirementName: "Transcript of Records",
        requirementStatus: false,
        requirementType: "document",
        denialReason: "Not yet available from previous institution"
      },
      {
        requirementName: "Character Reference",
        requirementStatus: true,
        requirementType: "document",
        imageUrl: "https://example.com/reference.pdf"
      }
    ]
  },
  {
    studentId: 1004,
    studentName: "Sarah Chen",
    firstName: "Sarah",
    middleName: "Mei",
    lastName: "Chen",
    applicationStatus: "Denied",
    denialDate: "2024-03-12",
    reviewedBy: "Prof. Lee",
    requirements: [
      {
        requirementName: "Application Form",
        requirementStatus: true,
        requirementType: "document",
        imageUrl: "https://example.com/application.pdf"
      },
      {
        requirementName: "Portfolio",
        requirementStatus: true,
        requirementType: "document",
        imageUrl: "https://example.com/portfolio.pdf"
      },
      {
        requirementName: "Interview Recording",
        requirementStatus: false,
        requirementType: "document",
        denialReason: "Interview not completed within the required timeframe"
      }
    ]
  }
]; 