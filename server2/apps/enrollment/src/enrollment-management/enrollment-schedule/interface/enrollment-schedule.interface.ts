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
    gradeLevelCode: string[];
    schedDate: {
      isPaused: boolean;
      DateString: string;
      startTime: string;
      endTime: string;
    }[];
    canChooseSection: boolean;
    slotCapacity: number;
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
    is_paused: boolean;
    can_choose_section: boolean;
  }[];
}
