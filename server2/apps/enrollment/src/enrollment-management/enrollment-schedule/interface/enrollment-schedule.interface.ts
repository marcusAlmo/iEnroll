export interface EnrollmentSchedule {
  gradeLevelRaw: {
    grade_level_offered_id: number;
    grade_level_code: string;
    grade_level: {
      grade_level: string;
    };
    enrollment_schedule: {
      schedule_id: number;
      application_slot: number;
      start_datetime: Date;
      end_datetime: Date;
      is_paused: boolean;
      can_choose_section: boolean;
    }[];
  }[];

  processedGradeLevel: {
    gradeLevelOfferedId: number;
    gradeLevelCode: string;
    gradeLevel: string;
    enrollmentSchedule: {
      scheduleId: number;
      applicationSlot: number;
      startDatetime: Date;
      endDatetime: Date;
      isPaused: boolean;
      canChooseSection: boolean;
    }[];
    slotCapacity: string;
  }[];

  receivedData: {
    gradeLevel: string;
    schedDate: {
      DateString: string;
      timeRanges: {
        startTime: string;
        endTime: string;
      }[];
    }[];
  };

  processStringDateReturn: {
    startDate: Date;
    endDate: Date;
  };

  preliminaryProccessOutput: {
    start_date_time: Date;
    end_date_time: Date;
    is_paused: boolean;
  }[];

  processReturn: {
    message: string;
  };

  storeData: {
    grade_level_offered_id: number;
    application_slot: number;
    start_datetime: Date;
    end_datetime: Date;
  }[];

  storeDataReturn: {
    success: boolean;
    message: string;
  };

  gradeLevelFormat: {
    schoolCapacity: {
      totalCapacity: number;
      remainingSlots: number;
    };
    gradeLevels: EnrollmentSchedule['gradeLevel'][];
  };

  gradeLevel: {
    gradeLevel: string;
    allowSectionSelection: boolean;
    sections: EnrollmentSchedule['section'][];
    schedules: EnrollmentSchedule['schedule'][];
  };

  section: {
    sectionName: string;
    sectionCapacity: number;
    maximumApplication: number;
    currentEnrolled: number;
  };

  gradeLevelCollection: {
    gradeLevel: string;
    allowSectionSelection: boolean;
  };

  sectionRaw: {
    sectionName: string;
    sectionCapacity: number;
    maximumApplication: number;
    currentEnrolled: number;
    gradeLevel: string;
  };

  schedule: {
    id: number;
    date: string; // in YYYY-MM-DD format
    timeRanges: EnrollmentSchedule['timeRange'][];
    applications: number;
    status: string;
    gradeLevel: string;
  };

  timeRange: {
    startTime: string;
    endTime: string;
  };

  scheduleRaw: {
    id: number;
    date: string; // in YYYY-MM-DD format
    timeRanges: EnrollmentSchedule['timeRange'];
    applications: number;
    status: string;
    gradeLevel: string;
  };

  scheduleReturn: {
    id: number;
    pastValue: boolean;
  };
}
